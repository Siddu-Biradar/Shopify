import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import ArrowUpRight16 from "@carbon/icons/es/arrow--up-right/16";
import HelpIcon from "@carbon/icons/es/help/16";
import { TranslationService } from "@cloudMatrix-CAM/cb-common-ui";
import { TitleService } from "../../dashboard/title-summary/title.service";
import { ActivatedRoute } from "@angular/router";
import { FilterService } from "../../services/filter.service";
import { DurationsService } from "../../util/durations.service";
import { CustomViewHandlerService } from "../../components/custom-view-handler/custom-view-handler.service";
import { AuthorizationService } from "../../services/authorization.service";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
} from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { GraphDuration } from "../../util/duration.interface";
import { DeploymentService } from "../../pagesV1/deployment/deployment.service";
import { DoraMetricsService } from "../../pagesV1/dora-metrics/dora-metrics.service";
import {
  getDisplayDate,
  getDurationParams,
  getRange,
  isNoDataAvailable,
  modifyTooltipRange,
  sortDataByDate,
  sortDoraLegends,
} from "../../util/misc-util";
import { QueryParams } from "../../util/query-params.interface";
import { COLOR_GREY_AVG, CURRENT_TIMEZONE, DEVELOPMENTDROPDOWNACCESSVIEW, RELEASE_MANAGEMENT_UPDATE_PERMISSION } from "../../util/constants";
import {
  CommitFrequencyRequest,
  CommitFrequencyResponse,
} from "./commit-frequency-pr-size-widget.model";
import {
  lineChartOptions,
  tooltipState,
} from "../dora-mttr-widget/dora-mttr-widget.component.constants";
import { customLineChartOptions } from "../../shidoka-components/customs-chart-options";
import e from "express";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-commit-frequency-pr-size-widget",
  templateUrl: "./commit-frequency-pr-size-widget.component.html",
  styleUrls: ["./commit-frequency-pr-size-widget.component.scss"],
})
export class CommitFrequencyPrSizeWidgetComponent implements OnChanges, OnInit {
 
  @ViewChild("sidePanel", { static: true }) sidePanel;
  @ViewChild('technicalServiceDropdown') technicalServiceDropdown;

  arrowUpRight = ArrowUpRight16;
  onArrowClick = false;
  showCommitFrequencyTable: boolean = false;
  showPRSizeTable: boolean = false;
  helpIcon = HelpIcon;
  pageFilterUpdated$ = new BehaviorSubject(true);
  combinedSubscription: Subscription;
  selectedApplications: any = "";
  selectedDuration: GraphDuration;
  lineChartDataSetArray = [];
  commitFrequencyDataSets = [];
  commitFrequencyDeveloperDataSets = [];
  legendColorMapping = {};
  options: any = lineChartOptions;
  commitsChartLoading: Observable<boolean>;
  averageCommitFrequency: string;
  averageDeveloperCommitFrequency: string;
  selectedChartType = "";
  tableTitle = this.translation.translate("developmentMetrics.commitFrequency");
  tableSubTitle = this.translation.translate("Productivity Metrics");
  noDataTitle = "";
  noDataSubTitle = "";
  decryptCode = -1;
  selectedDeveloper: any = [];
  selectedTechnicalService: any = [];
  developChartptions: any = lineChartOptions;
  developerCommitsChartLoading: Observable<boolean>;
  treemapDatasetsLoading: Observable<boolean>;
  selectedDeveloperNamesFormat = [];
  dataLoading = false;
  treemapDatasets: any = [];
  isAuthorised: boolean= false;
  prSizeChartptions = {
    scales: {
      x: {
        title: {
          text: "duration",
        },
      },
      y: {
        title: {
          text: "Gfff",
        },
      },
    },
  };
  cardContentData = [
    {
      cardTitle: this.translation.translate(
        "developmentMetrics.numberOfCommits"
      ),
      cardValue: 0,
    },
    {
      cardTitle: this.translation.translate("developmentMetrics.numberOfPRs"),
      cardValue: 0,
    },
  ];
  chartTypes = [
    {
      id: 0,
      content: this.translation.translate("Line Chart"),
      selected: false,
      value: "Line Chart",
    },
    {
      id: 1,
      content: this.translation.translate("Treemap"),
      selected: false,
      value: "Treemap",
    },
  ];
  datasets: any = [
    {
      key: "value",
      backgroundColor: "#8548B4",
      labels: {
        formatter: (ctx: any) => {
          if ("data" === ctx.type) return [ctx.raw._data.name];
          else return "";
        }
      },
      tree: [],
    }
  ];
  toptions: any = {
    plugins: {
    }
  };
  defaultAccessView = false;
  developerNamesList: any[] = [];
  technicalServiceList: any[] = [];
  tsCount: any= [];

  constructor(
    private readonly customViewService: CustomViewHandlerService,
    private readonly doraMetricsService: DoraMetricsService,
    private readonly deploymentService: DeploymentService,
    private readonly filterService: FilterService,
    private readonly route: ActivatedRoute,
    private readonly translation: TranslationService,
    private readonly authService: AuthorizationService,

  ) {
    this.isAuthorised = this.authService.hasPermissions(DEVELOPMENTDROPDOWNACCESSVIEW);
    this.noDataTitle = this.translation.translate("noDataForFilterSelection");
    this.noDataSubTitle = this.translation.translate("changeSelectionText");
    if (sessionStorage.getItem("decryptCode") === null) {
      sessionStorage.setItem("decryptCode", "235");
      this.decryptCode = 235;
    } else {
      try {
        this.decryptCode = parseInt(sessionStorage.getItem("decryptCode"));
      } catch (error) {}
    }
  }

  ngOnInit() {
    const combinedObservable$ = combineLatest([
      this.route.params,
      this.filterService.currentFilter,
      this.pageFilterUpdated$,
    ]).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map((results) => ({
        pathParam: results[0],
        filter: results[1],
        pageFilterUpdated: results[2],
      }))
    );
    this.technicalServiceDropdownData();
    this.setCombinedObservable(combinedObservable$);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    console.log("Changes:", _changes);
    this.commitFrequencyChartData();
  }

  onChangeSelection($event) {
    this.selectedChartType = $event.detail.value;
    this.chartTypes = [
      {
        id: 0,
        content: this.translation.translate("Line Chart"),
        selected: this.selectedChartType === "Line Chart",
        value: "Line Chart",
      },
      {
        id: 1,
        content: this.translation.translate("Treemap"),
        selected: this.selectedChartType === "Treemap",
        value: "Treemap",
      },
    ];
  }

  setCombinedObservable(observables$) {
    this.combinedSubscription = observables$.subscribe((data) => {
      const businessServices = [];
      if (data.filter["businessService"]) {
        data.filter["businessService"].forEach((item) => {
          businessServices.push(item.name);
        });
      }
      this.selectedApplications = businessServices.toString();
      this.selectedDuration = data.filter["selectedDuration"].value
        ? data.filter["selectedDuration"]
        : this.selectedDuration;

      const pageFilterUpdated = data?.pageFilterUpdated;

      //disable or enable custom view based on release selection
      this.customViewService.disableViewButtonSub.next(pageFilterUpdated);

      this.commitFrequencyChartData();
      if (this.selectedDeveloper && this.selectedDeveloper.length > 0 && this.isAuthorised) {
        this.fetchDeveloperCommitData();
      }
    });
  }

  decryptPI(param: any) {
    if (this.decryptCode === 235) {
      param.decryptCode = 235;
    }
  }

  developerPerformacanceDropdownData() {
    const params = {
      application: this.selectedApplications || "",
    };
    this.decryptPI(params);
    this.developerNamesList = [];
    this.doraMetricsService
      .developersListData(params)
      .subscribe((data: CommitFrequencyRequest[]) => {
        this.developerNamesList = data as any[];
      });
  }

  onDeveloperDropdownChanges($event) {
    this.selectedDeveloper = $event.detail.value;
    if (!this.selectedDeveloper || this.selectedDeveloper.length === 0) {
      this.selectedChartType = '';
      return;
    }
    this.fetchDeveloperCommitData();
    if (!this.selectedChartType || this.selectedChartType === '') {
      this.selectedChartType = '';
    }
    if(this.selectedDeveloper && this.selectedDeveloper.length > 0){
      this.selectedChartType = 'Line Chart';
      this.chartTypes[0].selected = true;

    }
  }
  
  technicalServiceDropdownData() {
    const params = {
      application: this.selectedApplications || "",
    };
    this.technicalServiceList = [];
    this.doraMetricsService
      .technicalServicesListData(params)
      .subscribe((data) => {
        const resultArray = Object.entries(data).map(([key, value]) => ({
          key: key,
          value: value,
        }));
        this.technicalServiceList = resultArray;
        if (this.isAuthorised){ this.developerPerformacanceDropdownData();}
      });
  }
  
  onTechnicalServiceDropdownChanges(selectedValues: any[]) {
    this.selectedTechnicalService = selectedValues;
    if (!this.selectedTechnicalService || this.selectedTechnicalService.length === 0) {
      this.commitFrequencyChartData();
    }
    this.commitFrequencyChartData();
  }

  commitFrequencyChartData(params?: any) {
    const durationParam: QueryParams = getDurationParams(this.selectedDuration);
    const getAllSelectedParams = {
      groupBy: "application",
      application: this.selectedApplications || "",
      previousDays: durationParam.previousDays,
      fromDate: durationParam.fromDate || "",
      toDate: durationParam.toDate || "",
      timezone: CURRENT_TIMEZONE,
      technicalServiceFilterList : this.selectedTechnicalService.length > 0
      ? this.selectedTechnicalService.join(",")
      : "",
    };
    this.commitsChartLoading = of(true);
    this.dataLoading = true;
    this.doraMetricsService
      .getCommitFrequencyChartData(getAllSelectedParams)
      .subscribe(
        (data: CommitFrequencyResponse) => {
          this.dataLoading = false;
          this.commitsChartLoading = of(false);
          this.averageCommitFrequency = `${
            data.avg_per_day
          }${this.translation.translate("developmentMetrics.commitsPerDay")}`;
          this.cardContentData[0].cardValue = data.total_commits;
          this.createChartApplicationKeys(data.commitsummary);
          this.constructChartData(data.commitsummary);
        },
        (_error) => {
          this.dataLoading = false;
          this.commitsChartLoading = of(false);
        }
      );
  }

  createChartApplicationKeys(inputDataArray) {
    const applications = [];
    inputDataArray.forEach((dataSet) => {
      if (dataSet?.commits?.length > 0) {
        dataSet.commits.forEach((item) => {
          const app =
            item.application ||
            this.translation.translate("common.unknownApplication");
          applications.push(app);
        });
      }
    });
    this.lineChartDataSetArray = sortDoraLegends([...new Set(applications)]);
  }

  fetchDeveloperCommitData(params?: any) {
    const durationParam: QueryParams = getDurationParams(this.selectedDuration);
    const getAllSelectedParams = {
      groupBy: "createdBy",
      application: this.selectedApplications || "",
      previousDays: durationParam.previousDays,
      fromDate: durationParam.fromDate || "",
      toDate: durationParam.toDate || "",
      createdByFilterList:
        this.selectedDeveloper.length > 0
          ? this.selectedDeveloper.join(",")
          : "",
      timezone: CURRENT_TIMEZONE,
      technicalServiceFilterList : this.selectedTechnicalService.length > 0
      ? this.selectedTechnicalService.join(",")
      : "",
    };
    this.decryptPI(getAllSelectedParams);
    this.developerCommitsChartLoading = of(true);
    this.treemapDatasetsLoading = of(true);
    this.doraMetricsService
      .getDeveloperCommitFrequency(getAllSelectedParams)
      .subscribe((data: CommitFrequencyResponse) => {
        this.averageDeveloperCommitFrequency = `${
          data.avg_per_day
        }${this.translation.translate("developmentMetrics.commitsPerDay")}`;
        const extractUniqueCreatedBy = (data) => {
          const allCreatedBy = data.flatMap((item) =>
            item.commits.flatMap((commit) => commit.created_by)
          );
          return [...new Set(allCreatedBy)];
        };
        this.developerCommitsChartLoading = of(false);
          this.treemapDatasetsLoading = of(false);

        this.selectedDeveloperNamesFormat = extractUniqueCreatedBy(
          data.commitsummary
        );
        this.constructDeveloperChartData(data.commitsummary);
        this.constructTreemapChartData(data.commitsummary);
      });
  }

  constructChartData(commitsummary) {
    const graphDataList = [];
    commitsummary.forEach((dataSet) => {
        const allApps = [...this.lineChartDataSetArray];
        const { from, to } = dataSet;
        const range = getRange(dataSet, this.selectedDuration.value);
        const timestamp = getDisplayDate(from, this.selectedDuration.value);
        const graphBaseObj = {
            group: "",
            date: timestamp.date,
            displayDate: timestamp.displayDate,
            range,
            fromDate: from,
            toDate: to,
            value: 0,
            technicalServiceCount: 0,
            color: "",
        };

        // Track the applications which have commits
        const committedApps = new Set();
        if (dataSet.commits?.length > 0) {
            dataSet.commits.forEach((item) => {
                committedApps.add(item.application);

                const graphObj = { ...graphBaseObj };
                graphObj.group = item.application;
                graphObj.value = item.count || 0; 
                graphObj.technicalServiceCount = item.technical_service_ids?.length || 0;
                graphObj.color = this.deploymentService.generateColorForString(item.application); 
                graphDataList.push(graphObj);
            });
        }
        //all applications in lineChartDataSetArray are accounted even if they had no commits
        allApps.forEach((app) => {
            if (!committedApps.has(app)) {
                const graphObj = { ...graphBaseObj };
                graphObj.group = app;
                graphObj.value = 0;
                graphObj.technicalServiceCount = 0;
                graphObj.color = this.deploymentService.generateColorForString(app);
                graphDataList.push(graphObj);
            }
        });
    });

    sortDataByDate(graphDataList);
    this.commitFrequencyDataSets = !isNoDataAvailable(graphDataList)
        ? [...graphDataList]
        : [];
    this.setOptions();
    this.setDeveloperOptions();
  }

  constructDeveloperChartData(commitsummary) {
    const graphDataList = [];
    commitsummary.forEach((dataSet) => {
      const allDevelopers = [...this.selectedDeveloperNamesFormat];
      const { from, to } = dataSet;
      const range = getRange(dataSet, this.selectedDuration.value);
      const timestamp = getDisplayDate(from, this.selectedDuration.value);

      const graphBaseObj = {
        group: "",
        date: timestamp.date,
        displayDate: timestamp.displayDate,
        range,
        fromDate: from,
        toDate: to,
        value: 0,
        color: "",
      };
      // Track each developer who made commits in this dataset
      const developerCommitMap = {};
      if (dataSet.commits?.length > 0) {
        dataSet.commits.forEach((item) => {
          item.created_by.forEach((createdBy) => {
            developerCommitMap[createdBy] = item.count;
            const graphObj = { ...graphBaseObj };
            graphObj.group = createdBy;
            graphObj.value = item.count || 0;
            graphObj.color =
              this.deploymentService.generateColorForString(createdBy);
            graphDataList.push(graphObj);
          });
        });
        allDevelopers.forEach((developer) => {
          if (!developerCommitMap[developer]) {
            const graphObj = { ...graphBaseObj };
            graphObj.group = developer;
            graphObj.value = 0;
            graphObj.color =
              this.deploymentService.generateColorForString(developer);
            graphDataList.push(graphObj);
          }
        });
      } else {
        allDevelopers.forEach((item) => {
          const graphObj = { ...graphBaseObj };
          graphObj.group = item;
          graphObj.value = 0;
          graphObj.color = this.deploymentService.generateColorForString(item);
          graphDataList.push(graphObj);
        });
      }
    });
    sortDataByDate(graphDataList);
    this.commitFrequencyDeveloperDataSets = !isNoDataAvailable(graphDataList)
      ? [...graphDataList]
      : [];
    this.setOptions();
  }

  setOptions() {
    this.options = { ...customLineChartOptions };
    this.options.scales = {
      ...customLineChartOptions.scales,
      x: {
        title: {
          text: this.translation.translate("common.duration"),
        },
      },
      y: {
        title: {
          text: this.translation.translate("developmentMetrics.noOfCommits"),
        },
      },
    };
    this.options.plugins = {
      tooltip: {
        callbacks: {
          // Suppress the default title (duration) rendering
          title: () => {
            return "";
          },
          // Suppress individual label rendering
          label: () => {
            return "";
          },
          // Combine everything in the afterBody
          afterBody: (context: any) => {
            const developers = context
              .map((item) => item.dataset.label)
              .join(", ");
            const duration = context[0].label;
            const commits = context[0].raw;
            return [
              `Application: ${developers}`,
              `Commits: ${commits}`,
              `Duration: ${duration}`,
            ];
          },
        },
      },
    };
  }

  setDeveloperOptions() {
    this.developChartptions = { ...customLineChartOptions };
    this.developChartptions.scales = {
      ...customLineChartOptions.scales,
      x: {
        title: {
          text: this.translation.translate("common.duration"),
        },
      },
      y: {
        title: {
          text: this.translation.translate("developmentMetrics.noOfCommits"),
        },
      },
    };
    this.developChartptions.plugins = {
      tooltip: {
        callbacks: {
          // Suppress the default title (duration) rendering
          title: () => {
            return "";
          },
          // Suppress individual label rendering
          label: () => {
            return "";
          },
          // Combine everything in the afterBody
          afterBody: (context: any) => {
            const developers = context
              .map((item) => item.dataset.label)
              .join(", ");
            const duration = context[0].label;
            const commits = context[0].raw;
            return [
              `Developer: ${developers}`,
              `Commits: ${commits}`,
              `Duration: ${duration}`,
            ];
          },
        },
      },
    };
  }

  openCommitFrequencySidePanel($event): void {
    this.onArrowClick = true;
    if (this.sidePanel) {
      this.sidePanel.openPanel();
    }
    if (this.sidePanel.open) {
      this.onArrowClick = true;
      this.showCommitFrequencyTable = true;
      this.showPRSizeTable = false;
    }
  }

  openPRsizeSidePanel($event): void {
    if (this.sidePanel) {
      this.sidePanel.openPanel();
    }
    if (this.sidePanel.open) {
      this.showCommitFrequencyTable = false;
      this.showPRSizeTable = true;
    }
  }

  onPanelClosed(event) {
    if (event === closed) {
      this.onArrowClick = false;
      this.showCommitFrequencyTable = false;
      this.showPRSizeTable = false;
    }
  }

  constructTreemapChartData(commitsData) {
    const commitCounts = new Map();
  
    // Loop through each commit summary in the provided data
    commitsData.forEach((summary) => {
      const { from, to } = summary;
      summary.commits.forEach((commit) => {
        const developer = commit.created_by[0];
  
        // Aggregate commit counts and dates per developer
        if (commitCounts.has(developer)) {
          const existingData = commitCounts.get(developer);
          existingData.value += commit.count;
          existingData.dates.push(from); // Collect dates
          commitCounts.set(developer, existingData);
        } else {
          // Initialize the developer's data with the commit count and dates
          commitCounts.set(developer, {
            value: commit.count,
            dates: [from],
          });
        }
      });
    });
  
    const treeData = Array.from(commitCounts, ([name, data]) => {
      const formattedDates = data.dates.map(date => {
        // Assuming you want only the date part
        const dateObj = new Date(date);
        return dateObj.toISOString().split('T')[0];
      }).filter((value, index, self) => self.indexOf(value) === index);
  
      return {
        name,
        value: data.value,
        showLabel: true,
        dates: formattedDates.join(', '),
      };
    });
  
    this.datasets[0].tree = treeData;
    this.toptions.plugins.tooltip = {
      callbacks: {
        // Suppress the default title (duration) rendering
        title: () => {
          return "";
        },
        // Suppress individual label rendering
        label: () => {
          return "";
        },
        afterBody: (context: any) => {
          const developer = context[0].raw._data.name || "";
          const commits = context[0].raw._data.value;
          const dates = context[0].raw._data.dates || "";
  
          return [
            `Developer: ${developer}`,
            `Commits: ${commits}`,
            `Dates: ${dates}`,
          ];
        }
      }
    };
  }

}
