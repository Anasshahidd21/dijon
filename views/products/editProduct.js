module.exports = ({
    product
}, errorString) => {
    return `<div>
<form method="POST" enctype="multipart/form-data">
    
    <input name="title" placeholder="${product.title}" />
    <div class= "errorPrint">${errorCheck(errorString.title)}</div>
    <input name="price" placeholder="${product.value}" />
    <div class = "errorPrint">${errorCheck(errorString.price)}</div>
    <input type="file" name="image" />
    <div class = "errorPrint">${errorCheck(errorString.image)}</div>
    <button>Submit</button><br><br><br>
</form>
</div>`
};

function errorCheck(property) {
    return property ? property : '';
}