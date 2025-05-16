import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  Post(url: string, data: any, headerObj?: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('accept', '*/*');
    const options = headerObj ? { ...headerObj, headers: headers, withCredintials: false } : { headers: headers, withCredintials: false };
    return this.http.post(url, data, options).pipe(
      tap(_ => this.log('response received')),
      catchError(this.handleError('Post', []))
    );
  }

  Get(url: string): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('accept', '*/*');
    const options = { headers: headers, withCredintials: false };
    return this.http.get(url, options).pipe(
      tap(_ => this.log('response received')),
      catchError(this.handleError('Get', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
  }

}
