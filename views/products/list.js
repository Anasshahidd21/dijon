module.exports = (list) => {



    return `<table class="listHeader">

    ${displayList(list)}


    </table>`
};

function displayList(list) {
    let arList = [];
    let i = 0;
    arList[i] = `<tr class="heading">
    <th>Product Title</th>
    <th>Value</th>  
    </tr>`
    i++;
    for (const item of list) {
        arList[i] = `<tr class="item">
        <td>${item.title}</td>
        <td>${item.value}</td>  
        </tr>`
        i++;
    }

    return arList.join('');
}