import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataSource } from 'devextreme/common/data';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridModule } from 'devextreme-angular';

import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DxDataGridModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  dataSource: any;

  constructor(private http: HttpClient) {
    //this.loadAsyncCustomStore();
    //this.loadSyncCustomStore();
    this.loadAsyncDataSource();
    //this.loadSyncDataSource();
  }

  private loadAsyncCustomStore() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: (loadOptions) => {
        const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? 6) + 1;
        const pageSize = loadOptions.take ?? 6;
    
        return this.http
          .get<any>(`https://reqres.in/api/users?page=${page}&per_page=${pageSize}`)
          .toPromise()
          .then((data) => (
            {
              data: data.data,
              totalCount: data.total,
            }
          ))
          .catch((error) => {
            throw 'Data loading error';
          });
      },
    });
  }

  private loadSyncCustomStore() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: async (loadOptions) => {
        const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? 6) + 1;
        const pageSize = loadOptions.take ?? 6;

        try {
          const response = await firstValueFrom(
            this.http.get<any>(`https://reqres.in/api/users?page=${page}&per_page=${pageSize}`)
          );

          return {
            data: response.data,
            totalCount: response.total,
          };
        } catch (error) {
          throw 'Data loading error';
        }
      },
    });
  }

  private loadAsyncDataSource() {
    this.dataSource = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: async (loadOptions) => {
          const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? 6) + 1;
          const pageSize = loadOptions.take ?? 6;
      
          return this.http
            .get<any>(`https://reqres.in/api/users?page=${page}&per_page=${pageSize}`)
            .toPromise()
            .then((data) => ({
              data: data.data,
              totalCount: data.total,
            }))
            .catch((error) => {
              throw 'Data loading error';
            });
        },
      })      
    });
  }
    
  private loadSyncDataSource() {
    this.dataSource = new DataSource({
      store: new CustomStore({
        key: 'id',
        loadMode: "processed",
        load: async (loadOptions) => {
          const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? 6) + 1;
          const pageSize = loadOptions.take ?? 6;
  
          try {
            const response = await firstValueFrom(
              this.http.get<any>(`https://reqres.in/api/users?page=${page}&per_page=${pageSize}`)
            );
  
            return {
              data: response.data,
              totalCount: response.total,
            };
          } catch (error) {
            throw 'Data loading error';
          }
        },
      })
    });
  }
}
