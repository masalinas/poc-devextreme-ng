import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataSource } from 'devextreme/common/data';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridModule } from 'devextreme-angular';

import { catchError, finalize, lastValueFrom, map, of } from 'rxjs';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [DxDataGridModule],
  providers: [
    UserService
  ]
})
export class AppComponent {
  dataSource: any;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    //this.loadAsyncCustomStore();
    //this.loadSyncCustomStore();
    //this.loadAsyncDataSource();
    //this.loadSyncDataSource();
    this.loadFromService();
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
          })
          .finally(() => {
            console.log("Data loaded");
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
          const response = await lastValueFrom(
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
            const response = await lastValueFrom(
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

  private loadFromService() {
    this.dataSource = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          return lastValueFrom(
            this.userService.get(loadOptions)
              .pipe(
                map((response: any) =>{
                  console.log('Data loaded')

                  return {
                    data: response.data,
                    totalCount: response.total,
                  }
                }),
                catchError((err) => {
                  console.error('Load failed', err);

                  return of([]);
                }),
                finalize(() => 
                  console.log('Finalize loaded')
                )
              )
          );
        },
        insert: (values) =>
          lastValueFrom(
            this.userService.insert(values)
              .pipe(
                catchError((err) => {
                  console.error('Insert failed', err)

                  return of(null);
                }),
                finalize(() => 
                  console.log('Finalize loaded')
                ),
              )
        ),        
        update: (key, values) =>
          lastValueFrom(
            this.userService.update(key, values)
              .pipe(
                catchError((err) => {
                  console.error('Update failed', err);
                  return of(null);
                }),                
                finalize(() => 
                  console.log('Finalize loaded')
                ),
              )
        ),
        remove: (key) =>
          lastValueFrom(
            this.userService.remove(key)
              .pipe(
                catchError((err) => {
                  console.error('Remove failed', err);

                  return of();
                }),
                finalize(() => 
                  console.log('Finalize loaded')
                ),
              )
        ),                
      })      
    });
  }
}
