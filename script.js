let products = [];

function showAddProductForm() {
    clearForm();
    document.getElementById("add-product-button").style.display = "block";
    document.getElementById("edit-product-button").style.display = "none";
    document.getElementById("cancel-edit-button").style.display = "none";
    document.getElementById("product-form").style.display = "block";
}

function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    if (name === "" || price === "") {
        alert("لطفاً نام و قیمت محصول را وارد کنید.");
        return;
    }
    products.push({
        name,
        price,
        description
    });
    updateProductList();
    saveProducts();
    clearForm();
    showProducts();
}


function showProducts() {
    hideForms();
    const productList = document.getElementById("product-list");
    productList.style.display = "block";
    const tableBody = document.getElementById("product-table-body");
    tableBody.innerHTML = "";
    products.forEach((product, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerHTML = `<button onclick="deleteProduct(${index})">حذف</button>`;
        row.insertCell(1).textContent = formatPrice(product.price);
        row.insertCell(2).textContent = product.description;
        row.insertCell(3).textContent = product.name;
        row.onclick = function() {
            editProduct(index);
        };
    });
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("description").value = product.description;
    document.getElementById("add-product-button").style.display = "none";
    document.getElementById("edit-product-button").style.display = "block";
    document.getElementById("cancel-edit-button").style.display = "block";
    document.getElementById("product-form").style.display = "block";
    document.getElementById("edit-product-button").setAttribute("onclick", `updateProduct(${index})`);
}

function updateProduct(index) {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    if (name === "" || price === "") {
        alert("لطفاً نام و قیمت محصول را وارد کنید.");
        return;
    }
    products[index] = {
        name,
        price,
        description
    };
    saveProducts();
    clearForm();
    showProducts();
}

function cancelEdit() {
    clearForm();
    hideForms();
    showProducts();
}

function deleteProduct(index) {
    const confirmDelete = confirm("آیا از حذف این محصول اطمینان دارید؟");
    if (confirmDelete) {
        products.splice(index, 1);
        showProducts();
        saveProducts();
        showProducts();
    }
}

function deleteAllProducts() {
    const confirmDelete = confirm("آیا از حذف تمام محصولات اطمینان دارید؟");
    if (confirmDelete) {
        products = [];
        showProducts();
        saveProducts();
        showProducts();
    }
}

function calculateTotalPrice() {
    const totalPrice = products.reduce((acc, curr) => acc + parseFloat(curr.price), 0);
    alert(`قیمت کل محصولات: ${formatPrice(totalPrice)}`);
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
}

function hideForms() {
    document.getElementById("product-form").style.display = "none";
    document.getElementById("product-list").style.display = "none";
}

function loadProducts() {
    const productList = getCookie("products");
    if (productList) {
        products = JSON.parse(productList);
        showProducts();
    }
}

function saveProducts() {
    setCookie("products", JSON.stringify(products), 30);
}

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
}

window.onload = loadProducts;
