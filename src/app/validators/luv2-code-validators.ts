import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2CodeValidators {

    //whitespace validation
    static noOnlyWhiteSpace(control:FormControl) : ValidationErrors{

        //check if the string contains whitespace
        if((control.value!= null) && (control.value.trim().length === 0)){

            //invalid : return error object

            return {'notOnlyWhitespace' : true }; 
        }
        else{
            // valid : return null

            return null;
        }

    }
}
