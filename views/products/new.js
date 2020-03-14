module.exports = ({
    req
}, errorString) => {
    return `<div>
 
<form method="POST" enctype="multipart/form-data">
    
    <input name="title" placeholder="title" />
    <div class= "errorPrint">${errorCheck(errorString.title)}</div>
    <input name="price" placeholder="price" />
    <div class = "errorPrint">${errorCheck(errorString.price)}</div>
    <input type="file" name="image" />
    <div class = "errorPrint">${errorCheck(errorString.image)}</div>
    <button>Submit</button><br><br><br>
    <div>Session ID: ${req.session.userID}</div>
</form>
</div>`
};

function errorCheck(property) {
    return property ? property : '';
}