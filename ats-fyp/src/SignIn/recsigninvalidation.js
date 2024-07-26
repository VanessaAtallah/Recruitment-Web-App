function validation(formData){
    let error={}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
    if(formData.email === ""){
        error.email = "Email should not be empty";
    }
    else if(!email_pattern.test(formData.email)){
        error.email = "Email format is invalid";
    }
    else {
        error.email = "";
    }

    if(formData.password === ""){
        error.password = "Password should not be empty";
    }
    else {
        error.password = "";
    }

    return error;
}

export default validation;
