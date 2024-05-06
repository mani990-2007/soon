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
    const image = document.getElementById("image").files[0];
    let imageURL = "";
    if (image) {
        imageURL = URL.createObjectURL(image);
    }
    if (name === "" || price === "") {
        alert("لطفاً نام و قیمت محصول را وارد کنید.");
        return;
    }
    const available = document.querySelector('input[name="availability"]:checked').value === "true";
    products.push({
        name,
        price,
        description,
        imageURL,
        available
    });
    showProducts();
    updateProductList();
    saveProducts();
    clearForm();
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
        const availabilityCell = row.insertCell(4);
        availabilityCell.textContent = product.available ? "موجود" : "ناموجود";
        availabilityCell.className = "availability " + product.available;
        const imageCell = row.insertCell(5);
        const image = document.createElement("img");
        image.src = product.imageURL;
        image.alt = "تصویر محصول";
        image.width = 50;
        image.height = 50;
        imageCell.appendChild(image);
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
    document.getElementById("preview").src = product.imageURL;
    document.getElementById("preview").style.display = "block";
    document.getElementById("add-product-button").style.display = "none";
    document.getElementById("edit-product-button").style.display = "block";
    document.getElementById("edit-product-button").setAttribute("onclick", `updateProduct(${index})`);
    document.getElementById("cancel-edit-button").style.display = "block";
    document.getElementById("product-form").style.display = "block";
    if (product.available) {
        document.getElementById("available").checked = true;
    } else {
        document.getElementById("unavailable").checked = true;
    }
}

function updateProduct(index) {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").files[0];
    let imageURL = "";
    if (image) {
        imageURL = URL.createObjectURL(image);
    }
    if (name === "" || price === "") {
        alert("لطفاً نام و قیمت محصول را وارد کنید.");
        return;
    }
    const available = document.querySelector('input[name="availability"]:checked').value === "true";
    products[index] = {
        name,
        price,
        description,
        imageURL,
        available
    };
    showProducts();
    saveProducts();
    clearForm();
}

function cancelEdit() {
    showProducts();
    clearForm();
    hideForms();
    showProducts();
}

function deleteProduct(index) {
    const confirmDelete = confirm("آیا از حذف این محصول اطمینان دارید؟");
    if (confirmDelete) {
        deleteProductFromLocalStorage(index); // اضافه کردن حذف محصول از Local Storage
        products.splice(index, 1);
        showProducts();
        saveProducts();
        
        // بارگذاری مجدد محصولات از Local Storage
        loadProducts();
    }
}

function deleteAllProducts() {
    const confirmDelete = confirm("آیا از حذف تمام محصولات اطمینان دارید؟");
    if (confirmDelete) {
        localStorage.removeItem("products"); // حذف همه محصولات از Local Storage
        products = [];
        showProducts();
        saveProducts();
        
        // بارگذاری مجدد محصولات از Local Storage
        loadProducts();
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
    document.getElementById("image").value = "";
    document.getElementById("preview").style.display = "none";
    document.getElementById("available").checked = true; // تنظیم موجودی به حالت پیش‌فرض
}

function hideForms() {
    document.getElementById("product-form").style.display = "none";
    document.getElementById("product-list").style.display = "none";
}

function loadProducts() {
    const productsFromLocalStorage = localStorage.getItem("products");
    if (productsFromLocalStorage) {
        products = JSON.parse(productsFromLocalStorage);
        showProducts();
    }
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
}

window.onload = loadProducts;
