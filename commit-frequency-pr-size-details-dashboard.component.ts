import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslationService } from '@cloudMatrix-CAM/cb-common-ui';
import { commitFrequencyDetailsTableFields, PRsizeTableFields } from './commit-frequency-pr-size-details-dashboard-mapping';
import { PaginationModel } from 'carbon-components-angular';
import { getOffset, getTableCoumnsFromSettings } from '../../util/misc-util';
import { TableIDs } from '../../config/data-table-config';
import { DoraMetricsService } from '../../pagesV1/dora-metrics/dora-metrics.service';
import { commitFrequencyDataResponse } from '../commit-frequency-pr-size-widget/commit-frequency-pr-size-widget.model';
import { CURRENT_TIMEZONE } from '../../util/constants';
import { QueryParams } from '../../util/query-params.interface';
import { error } from 'console';

@Component({
  selector: 'app-commit-frequency-pr-size-details-dashboard',
  templateUrl: './commit-frequency-pr-size-details-dashboard.component.html',
  styleUrls: ['./commit-frequency-pr-size-details-dashboard.component.scss']
})
export class CommitFrequencyPrSizeDetailsDashboardComponent implements OnChanges, OnInit {
  

  @Input() showPRSizeTable: boolean ;
  @Input() showCommitFrequencyTable : boolean ;
  @Input() selectedService = '';
  @Input() applications = '';



  

  commitFrequencyDetailsTableFields = commitFrequencyDetailsTableFields;
  PRsizeTableFields = PRsizeTableFields;
  detailsTableTitle: string = TableIDs.developerActivityDetailsPage.developerActivityDetailsTable;
  prSizeTableId: string = TableIDs.developerActivityDetailsPage.prSizeActivityDetailsTable;
  limit = 25;
  detailTableTotal = 0;
  pageNumber = 1;
  offset = 0;
  servicePaginationModel = new PaginationModel();
  tableSortingTracker = [];
  PRsizeTableSortingTracker=[];
  ascending = false;
  tablesort = { orderBy: 'technicalservice', sortOrder: '' };
  commitDetailSearchQuery= '';
  decryptCode = -1;
  tablesortPRSize = { orderBy: 'status', sortOrder: 'descending' };
  commitFrequencyDetailsTableData = [];
  commitFrequencyDetailsTableLoading = false;
  prSizeDetailsTableData = [
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },

    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    }, {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },
    {
      prNumber: '0FCD39AFF8AC544A5D185FFB36AA64E258C83CB7',
      application: 'Application one',
      technicalsService: 'Technical Service 1',
      prStatus: '2024-09-27',
      prMessage: 'This is a commit message',
      createdOn: 'sidrameshwar.biradar@kyndryl.com',
      mergedOn: 1234567,
      noOfFilesChanged: 'sidrameshwar.biradar@kyndryl.com',
      noOfComments :4,
      assignedTo :  'sidrameshwar.biradar@kyndryl.com',
    },

  ]

  constructor(
    private readonly translation: TranslationService,
    private readonly doraMetricsService: DoraMetricsService,
    
  ) {
   
    if (sessionStorage.getItem('decryptCode') === null) {
      sessionStorage.setItem('decryptCode', "235");
      this.decryptCode = 235;
    } else {
      try {
        this.decryptCode = parseInt(sessionStorage.getItem('decryptCode'));
      } catch (error) {}
    }
    
  }

  ngOnInit() {
    // this.commitFrequencyTableData();
    this.setCommitFrequencyTableSortingTrackerObject();
    this.setPRsizeTableSortingTrackerObject();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes', changes);
    if (changes?.selectedService?.currentValue) {
      this.selectedService = changes?.selectedService.currentValue;
    }
    const params = {
      technicalServiceFilterList: Array.isArray(this.selectedService) ? this.selectedService.join(',') : this.selectedService,
    };
    this.commitFrequencyTableData(params);
  }

  commitFrequencyTableData(params?: any) {
    const queryParams = {
      application: this.applications,
      orderBy: this.tablesort.orderBy || '',
      sortOrder: this.tablesort.sortOrder || '',
      offset : this.offset,
      limit : this.limit,
      search : this.commitDetailSearchQuery || '',
      timezone : CURRENT_TIMEZONE,
      ...params
    }
    this.decryptPI(queryParams);
    this.commitFrequencyDetailsTableLoading = true;
    this.doraMetricsService.getCommitFrequencyTableData(queryParams).subscribe((data : commitFrequencyDataResponse ) => {
        this.commitFrequencyDetailsTableLoading = false;

        this.detailTableTotal = data.pagination && data.pagination.total;
        const rows = [];
        if (data.commit_details) {
          data.commit_details.forEach((item) => {
            const applicationList = this.setApplicationList(item?.['application_relationships'] || []);
            rows.push({
              commitId :{
                linkDisplayValue: item.commit_id,
                linkUrl: item.commit_url,
              },
              application: applicationList,
              commitDate  : item.commit_date || '',
              commitMessage :item.commit_message || '',
              committed_developer : item.committed_developer || '',
              technicalsService : item.technical_service || '',
              linkedPR : item.pr_linked || '',
              CommittedDeveloper : item.committed_developer || '',
            });
          });
        }
        this.commitFrequencyDetailsTableData = [...rows];
    },error => {
      this.commitFrequencyDetailsTableLoading = false;
    })

  }

  setApplicationList(applications) {
    if (!applications || !Object.keys(applications).length) {
      return ''; 
    }
    if (Array.isArray(applications)) {
      return applications.filter(app => app?.application_name)
        .map(app => app.application_name);
    }
    return applications.application_name ? [applications.application_name] : '';
  }

  decryptPI(param: any) {
    if (this.decryptCode === 235) {
      param.decryptCode = 235;
    }
  }

  commitFrequencyDetailSearchQueryCheckSearch(searchQuery : string){
    this.commitDetailSearchQuery = searchQuery;
    this.offset = 0;
    this.pageNumber = 1;
    this.commitFrequencyTableData()
  }

  commitFrequencyTableHeaderClicked($event: any) {
    this.pageNumber = 1;
    this.offset = 0;
    this.servicePaginationModel.currentPage = 1;
    this.handleCommitFrequencyTableSorting($event);
  } 

  pageSizeChanged(event: any) {
    if(this.offset===0){
      this.pageNumber = 1;
    }
    if (event === "" || Number(event) === this.pageNumber) {
      return;
    }
    this.limit =  event
    this.offset = getOffset(this.pageNumber, this.limit);
    this.commitFrequencyTableData();
  }

  pageNumberChanged(event: any) {
    if(this.offset===0){
      this.pageNumber = 1;
    }
    if (event === "" || Number(event) === this.pageNumber) {
      return;
    }
    this.pageNumber = event;
    this.offset = getOffset(this.pageNumber, this.limit);
    

    // this.onTablePageChange(this.pageNumber);
    this.commitFrequencyTableData();
  }

  setCommitFrequencyTableSortingTrackerObject() {
    this.commitFrequencyDetailsTableFields.forEach(header => {
      if (header.sortable) {
        this.tableSortingTracker.push({
          fieldName: header.fieldName,
          sortOrder: 'ascending'
        });
      }
    });
  }

  handleCommitFrequencyTableSorting(index) {
    const column = getTableCoumnsFromSettings(this.detailsTableTitle, this.commitFrequencyDetailsTableFields)[index] as any;
    const clickedHeaderName = this.tableSortingTracker.find(
      header => header.fieldName === column.fieldName
    );
    this.ascending = !this.ascending;
    this.offset = 0;
    this.tablesort = {
      orderBy: column.orderByKey ? column.orderByKey : column.fieldName,
      sortOrder: this.ascending ? 'ascending' : 'descending'
    };
    this.tableSortingTracker.forEach(header => {
      if (header.fieldName !== clickedHeaderName.fieldName) {
        header.sortOrder = 'ascending';
      } else {
        header.sortOrder =
          header.sortOrder === 'ascending' ? 'descending' : 'ascending';
      }
    });
  }

  tableHeaderClicked($event){
    this.pageNumber = 1;
    this.offset = 0;
    this.servicePaginationModel.currentPage = 1;
    this.handlePRsizeTableSorting($event);
  }

  handlePRsizeTableSorting(index) {
    const column = getTableCoumnsFromSettings(this.prSizeTableId, this.PRsizeTableFields)[index] as any;
    const clickedHeaderName = this.PRsizeTableSortingTracker.find(
      header => header.fieldName === column.fieldName
    );
    this.ascending = !this.ascending;
    this.offset = 0;
    this.tablesortPRSize = {
      orderBy: column.orderByKey ? column.orderByKey : column.fieldName,
      sortOrder: this.ascending ? 'ascending' : 'descending'
    };
    this.PRsizeTableSortingTracker.forEach(header => {
      if (header.fieldName !== clickedHeaderName.fieldName) {
        header.sortOrder = 'ascending';
      } else {
        header.sortOrder =
          header.sortOrder === 'ascending' ? 'descending' : 'ascending';
      }
    });
  }

  setPRsizeTableSortingTrackerObject() {
    this.PRsizeTableFields.forEach(header => {
      if (header.sortable) {
        this.PRsizeTableSortingTracker.push({
          fieldName: header.fieldName,
          sortOrder: 'ascending'
        });
      }
    });
  }

}
