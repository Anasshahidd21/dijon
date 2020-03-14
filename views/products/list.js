module.exports = (list) => {
    return `
    <table class="listHeader">
    ${displayList(list)}
    </table>
    `
};



function displayList(list) {
    let arList = [];
    let i = 0;
    arList[i] = `<tr class="heading">
    <th>Product Title</th>
    <th>Value</th>  
    <th class= "icon-add"><a href="/products/create"><i class="fas fa-plus"></i></a></th>
    </tr>`
    i++;
    for (const item of list) {
        arList[i] = `<tr class="item">
        <td>${item.title}</td>
        <td>${item.value}</td>  
        <td class = "icon-edit"><a href="/edit/${item.id}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></td>
        <td class = "icon-delete"><i class="fa fa-times" aria-hidden="true"></i></td>
        </tr>`
        i++;
    }

    return arList.join('');
}