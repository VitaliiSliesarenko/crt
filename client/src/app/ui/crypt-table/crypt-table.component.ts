import { Component, OnInit, Input } from '@angular/core';
import { CryptTableData } from '../../business/components/crypt-table/crypt-table-data';

@Component({
  selector: 'app-crypt-table',
  templateUrl: './crypt-table.component.html',
  styleUrls: ['./crypt-table.component.css']
})
export class CryptTableComponent implements OnInit {

  @Input() tableData: CryptTableData;

  constructor() { }

  ngOnInit() {
  }

}
