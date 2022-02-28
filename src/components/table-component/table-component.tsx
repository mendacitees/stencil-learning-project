//import { Component, Prop, Host, State, Watch, Element, Event, EventEmitter, h, Listen } from '@stencil/core';
import { Component, Prop, Host, Watch, Element, State, h } from '@stencil/core';
import { TableHeader } from '../../interfaces/TableHeader';


@Component({
  tag: 'table-component',
  styleUrl: 'table-component.css',
  shadow: true,
})
export class MyComponent {
  @Element() el: HTMLElement;

  @Prop() headers: string;
  @Prop() items: string;
  @Prop({ mutable: true, reflect: true }) sortColumn: string; 
  @Prop({ mutable: true, reflect: true }) sortAscending: boolean = true; 

  @State() aHeaders: Array<TableHeader>;
  @State() aItems: Array<object>;
  @State() rowcount: number = 0;
  @State() colcount: number = 0;


  @Watch('headers')
  headersWatcher(newValue: string) {     
    if (typeof newValue === 'string') {
      console.log("headers recieved as a string - from HTML Attribute");
       this.aHeaders = JSON.parse(newValue);       
       this.colcount = (this.aHeaders).length;       
    }
    else {
      if (Array.isArray(this.headers)) {
        console.log("headers recieved as an array - from Javascript");
        this.aHeaders = newValue;
        this.colcount = (this.aHeaders).length;
      }
      else {
        console.error("Headers must be an array");
      }      
    }
  }


  @Watch('items')
  itemsWatcher(newValue: string) {    
    if (typeof newValue === 'string') {
      console.log("items recieved as a string - from HTML Attribute");
       this.aItems = JSON.parse(newValue);
       this.rowcount = (this.aItems).length;
    }
    else {
      if (Array.isArray(this.items)) {
        console.log("items recieved as an array - from Javascript");
        this.aItems = newValue;
        this.rowcount = (this.aItems).length;
      }
      else {
        console.error("Items must be an array");
      }      
    }
  } 
  
  @Watch('sortColumn')
  sortColumnWatcher(newValue: string, oldValue: string) {
    console.log("IN sortColumn WATCH:: oldValue: " + oldValue + " | newValue: " + newValue);
    this.sortTable();
  }

  @Watch('sortAscending')
  sortAscendingWatcher(newValue: string, oldValue: string) {
    console.log("IN sortAscending WATCH:: oldValue: " + oldValue + " | newValue: " + newValue);
    this.sortTable();
  } 

  connectedCallback() {
    //console.log("1 - connectedCallback");
  }

  componentWillLoad() {
    //Watchers don't get called on initial component load
    //so we force it here.
    this.headersWatcher(this.headers);
    this.itemsWatcher(this.items);
    this.sortTable();
  }

  componentWillRender() {
    //console.log("3 - componentWillRender")
  }


  private getClasses(header: TableHeader) {
    // all these classes come from Material Design Lite
    // adding these classes does all the work of formatting
    // the table and even adds the sorting icons on the 
    // column headers as necessary. To Do:  handle center
    // aligned content.  Only left and right aligned are
    // handled currently
    let sOut = "";
     if (header.sortable === true) {
      sOut += " mdc-data-table__header-cell--with-sort";
    }
    if ((header.align).toString() === 'left') {
      sOut += " mdl-data-table__cell--non-numeric";
    }
    if (header.value === this.sortColumn) {
      if (this.sortAscending) {
        sOut += " mdl-data-table__header--sorted-ascending";
      }
      else {
        sOut += " mdl-data-table__header--sorted-descending";
      }      
    }    
    return sOut;
  }  

  private sortTable() {
    console.log("in sortTable function");
    let sColumn = this.sortColumn;
    this.aItems.sort(function(a, b) {
      var nameA = a[sColumn].toUpperCase();
      var nameB = b[sColumn].toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    this.aItems = (this.sortAscending) ? [...this.aItems] : [...this.aItems].reverse();
  }

  private triggerSort(event: MouseEvent, header: TableHeader): void {
    //set field and direction to sort on
    //and call this.tableSort()
    //log the event to get rid of that stupid warning
    console.log("triggerSort: ", event);
    if (header.sortable === true) {
      //this happens when the same column is clicked
      //a second time, so we revert the sort order
      if (this.sortColumn === header.value) {
        this.sortAscending = !this.sortAscending;
      }
      else {
        this.sortColumn = header.value;
      }
      this.sortTable();
    }
    else {
      console.log("DO NOT SORT")
    }
  }   

  render() {
    //console.log("4 - render")
    return (
      <Host>
        <table class="mdl-data-table mdl-js-data-table mdl-shadow--4dp mdl-data-table--selectable">
          <thead>
            <tr>
              {this.aHeaders.map((header) =>
                <th 
                class={this.getClasses(header)}
                data-sortable={header.sortable}
                onClick={e => this.triggerSort(e, header)}
                >
                  {header.text}
                </th>
              )}            
            </tr>
          </thead>
          <tbody>
            {this.aItems.map((item) =>
                <tr>
                  {this.aHeaders.map((header) =>
                    <td class={(header.align === 'left') ? 'mdl-data-table__cell--non-numeric' : ''}>
                      {item[header.value]}
                    </td>
                  )}
                </tr>
            )}  
          </tbody>
        </table>
      </Host>
    )
  }



  componentDidRender() {
    //console.log("5 - componentDidRender")
  }

  componentDidLoad() {
    //console.log("6 - componentDidLoad")
  }  


}
