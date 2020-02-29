module.exports = ({
    req
}, errorString) => {
    return `<div>
 
<form method="POST">
    <input name="email" placeholder="email" />
    <div class= "errorPrint">${errorCheck(errorString.email)}</div>
    <input name="password" placeholder="password" />
    <div class = "errorPrint">${errorCheck(errorString.password)}</div>
    <input name="passwordConfirmation" placeholder="passwordConfirmation" />
    <div class = "errorPrint">${errorCheck(errorString.passwordConfirmation)}</div>
    <button>Sign up</button><br><br><br>
       <div>Session ID: ${req.session.userID}</div>
</form>
</div>`
};

function errorCheck(property) {

    return property ? property : '';
    // if (property) {
    //     return property;
    // }
    // return '';
}