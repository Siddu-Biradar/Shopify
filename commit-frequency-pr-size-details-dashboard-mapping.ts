export const commitFrequencyDetailsTableFields = [
    {
      fieldName: 'commitId',
      headerName: 'Commit ID',
      headerNameKey: 'developmentMetrics.commitId',
      flexSize: 1,
      cellContent: 'linkObject',
      sortable: true,
      tableHeader: true,
      show: true,
      order: 1,
      freeze: true,
      colWidth: '8%',
    },
    {
      fieldName: 'application',
      headerName: 'Application',
      headerNameKey: 'developmentMetrics.application',
      flexSize: 1,
      cellContent: 'text',
      sortable: true,
      tableHeader: true,
      show: true,
      order: 2,
      freeze: true,
      colWidth: '8%',
    },
    {
      fieldName: 'technicalsService',
      headerName: 'Technicals service',
      headerNameKey: 'developmentMetrics.technicalsService',
      flexSize: 1,
      cellContent: 'text',
      sortable: true,
      tableHeader: true,
      show: true,
      order: 3,
      freeze: true,
      colWidth: '12%',
    },
    {
        fieldName: 'commitDate',
        headerName: 'Commit Date',
        headerNameKey: 'developmentMetrics.commitDate',
        flexSize: 1,
        cellContent: 'text',
        sortable: true,
        tableHeader: true,
        show: true,
        order: 4,
        freeze: true,
        colWidth: '12%',
    },
    {
        fieldName: 'commitMessage',
        headerName: 'Commit Message',
        headerNameKey: 'developmentMetrics.commitMessage',
        flexSize: 5,
        cellContent: 'text',
        sortable: true,
        tableHeader: true,
        show: true,
        order: 5,
        freeze: true,
        colWidth: '15%',
    },
    {
        fieldName: 'linkedPR',
        headerName: 'Linked PR',
        headerNameKey: 'developmentMetrics.linkedPR',
        flexSize: 1,
        cellContent: 'text',
        sortable: true,
        tableHeader: true,
        show: true,
        order: 7,
        freeze: true,
        colWidth: '16%',
    },
    {
        fieldName: 'CommittedDeveloper',
        headerName: 'Committed Developer',
        headerNameKey: 'developmentMetrics.assignedTo',
        flexSize: 1,
        cellContent: 'text',
        sortable: true,
        tableHeader: true,
        show: true,
        order: 8,
        freeze: true,
        colWidth: '15%',
    },
  ];

export const PRsizeTableFields = [
  {
    fieldName: 'prNumber',
    headerName: 'PR Number',
    headerNameKey: 'developmentMetrics.prNumber',
    flexSize: 1,
    cellContent: 'text',
    sortable: true,
    tableHeader: true,
    show: true,
    order: 1,
    freeze: true
  },
  {
    fieldName: 'application',
    headerName: 'Application',
    headerNameKey: 'developmentMetrics.application',
    flexSize: 1,
    cellContent: 'text',
    sortable: false,
    tableHeader: true,
    show: true,
    order: 2,
    freeze: true
  },
  {
    fieldName: 'technicalsService',
    headerName: 'Technicals service',
    headerNameKey: 'developmentMetrics.technicalsService',
    flexSize: 1,
    cellContent: 'text',
    sortable: false,
    tableHeader: true,
    show: true,
    order: 3,
    freeze: true
  },
  {
      fieldName: 'prStatus',
      headerName: 'PR status',
      headerNameKey: 'developmentMetrics.prStatus',
      flexSize: 1,
      cellContent: 'text',
      sortable: true,
      tableHeader: true,
      show: true,
      order: 4,
      freeze: true
  },
  {
      fieldName: 'prMessage',
      headerName: 'PR Message',
      headerNameKey: 'developmentMetrics.prMessage',
      flexSize: 5,
      cellContent: 'text',
      sortable: false,
      tableHeader: true,
      show: true,
      order: 5,
      freeze: true
  },
  {
      fieldName: 'createdOn',
      headerName: 'Created On',
      headerNameKey: 'developmentMetrics.createdOn',
      flexSize: 1,
      cellContent: 'text',
      sortable: false,
      tableHeader: true,
      show: true,
      order: 6,
      freeze: true
  },
  {
      fieldName: 'mergedOn',
      headerName: 'Merged On',
      headerNameKey: 'developmentMetrics.mergedOn',
      flexSize: 1,
      cellContent: 'text',
      sortable: false,
      tableHeader: true,
      show: true,
      order: 7,
      freeze: true
  },
  {
      fieldName: 'noOfFilesChanged',
      headerName: 'No. of Files Changed',
      headerNameKey: 'developmentMetrics.noOfFilesChanged',
      flexSize: 1,
      cellContent: 'text',
      sortable: false,
      tableHeader: true,
      show: true,
      order: 8,
      freeze: true
  },
  {
    fieldName: 'noOfComments',
    headerName: 'No. of Comments',
    headerNameKey: 'developmentMetrics.noOfComments',
    flexSize: 1,
    cellContent: 'text',
    sortable: false,
    tableHeader: true,
    show: true,
    order: 9,
    freeze: true
},
{
    fieldName: 'assignedTo',
    headerName: 'Assigned To',
    headerNameKey: 'developmentMetrics.assignedTo',
    flexSize: 1,
    cellContent: 'text',
    sortable: false,
    tableHeader: true,
    show: true,
    order: 10,
    freeze: true
},
];
