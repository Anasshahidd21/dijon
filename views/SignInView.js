module.exports = ({
    req
}, errorString) => {
    return `<div>
<form method="POST">
    <input name="email" placeholder="email" />
    <div class= "errorPrint">${errorCheck(errorString.email)}</div>
    <input name="password" placeholder="password" />
    <div class = "errorPrint">${errorCheck(errorString.password)}</div>
    <button>Sign In</button>
</form>
</div>`
}

function errorCheck(property) {
    return property ? property : '';
}