  setTableItem(header, data, index) {
    const templateObj = {
      'template': this.generateTableItemForTemplate(header, data, index),
      'text': new TableItem({ data: data[header.fieldName] ? data[header.fieldName] : this.BLANKVALUETEXT }),
      'date': new TableItem({ data: data[header.fieldName] ? setDateFormatForTable(new Date(data[header.fieldName]), false) : this.BLANKVALUETEXT }),
      'number': new TableItem({ data: data[header.fieldName] ? data[header.fieldName] : this.ZEROVALUETEXT }),
      'launch': new TableItem({
        data: data[header.fieldName],
        template: this.launchTemplate,
        header: header.fieldName
      }),
      'graph': new TableItem({
        data: data[header.fieldName],
        template: this.dynamicTemplate,
        header: header.fieldName
      }),
      'ellipsis': new TableItem({
        data: data[header.fieldName],
        template: this.tableCellTemplate,
        header: header.fieldName
      }),
      'snippet': new TableItem({
        data: data[header.fieldName],
        template: this.snippetTemplate,
        header: header.fieldName
      }),
      'linkObject': new TableItem({
        data: {
          name: data[header.fieldName] && data[header.fieldName].linkDisplayValue,
          link: data[header.fieldName] && data[header.fieldName].linkUrl,
        },
        header: header.fieldName,
        template: this.customItemTemplate,
      }),
      'numericLinkObject': new TableItem({
        data: {
          name: data[header.fieldName] && data[header.fieldName].linkDisplayValue,
          link: data[header.fieldName] && data[header.fieldName].linkUrl,
          issue_engine: data?.issue_engine,
          linkToolsTip: this.translation.translate('develop.openInTool', { 'tool': data?.issue_engine })
        },
        header: header.fieldName,
        template: this.numericLinkTemplate,
      }),
      'linkDetailsPage': new TableItem({
        data: {
          name: data[header.fieldName],
          header: header.fieldName,
          index
        },
        template: this.linkDetailsPageTemplate
      }),
      'nameTemplate': new TableItem({
        data: data[header.fieldName],
        template: this.NameTemplate,
        title: data[header.fieldName]?.name,
        header: header.fieldName
      }),
      'componentTemplateWithExpansion': new TableItem({
        data: data[header.fieldName],
        header: header.fieldName,
        template: this.templateList && this.templateList[header.templateName],
        expandedData: data[header.fieldName]?.expandedData,
        expandedTemplate: this.templateList && this.templateList[header.expandedTemplate]
      }),
      'componentTemplate': new TableItem({
        data: {
          data: header.fieldName ? data[header.fieldName] : data,
          header: header.fieldName,
          index,
          fullData: data
        },
        template: this.templateList && this.templateList[header.templateName]
      })
    };

    return templateObj[header.cellContent]
      ? templateObj[header.cellContent]
      : new TableItem({
        data: data[header.fieldName] ? data[header.fieldName] : this.BLANKVALUETEXT
      });
  }
