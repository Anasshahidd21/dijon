module.exports = ({
    req
}, errorString) => {
    return `<div>
 
<form method="POST">
    <input name="title" placeholder="title" />
    <div class= "errorPrint">${errorCheck(errorString.title)}</div>
    <input name="price" placeholder="price" />
    <div class = "errorPrint">${errorCheck(errorString.price)}</div>
    <input name="image" placeholder="image" />
    <div class = "errorPrint">${errorCheck(errorString.image)}</div>
    <button>Sign up</button><br><br><br>
       <div>Session ID: ${req.session.userID}</div>
</form>
</div>`
};

function errorCheck(property) {
    return property ? property : '';
}