import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap, debounceTime, catchError, of, first } from 'rxjs';
import { HttpAPIClientService } from '../Services/http-api-client.service';
import { ToastrService } from 'ngx-toastr';

export function emailExistsValidator(
    httpApiClient: HttpAPIClientService,
    tostr: ToastrService,
    isEditMode: () => boolean,
    originalEmailGetter: () => string,
    setLoading: (isLoading: boolean) => void,

): AsyncValidatorFn {
    return (control: AbstractControl) => {
        if (!control.value) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(500),
            switchMap(email => {
                if (isEditMode() && email === originalEmailGetter()) {
                    return of(null);
                }

                setLoading(true); // start loader

                return httpApiClient.CheckEmailExists(email).pipe(
                    map((response: any) => {
                        if (response?.data) {
                            tostr.error("Email already take", "Email");
                        } else {
                            tostr.success("Email available", "Email");
                        }
                        return response?.data ? { emailTaken: true } : null;

                    }),
                    catchError(() => of(null)),
                    first(),
                    map(result => {
                        setLoading(false); // stop loader after completion
                        return result;
                    })
                );
            }),
            first()
        );
    };
}
