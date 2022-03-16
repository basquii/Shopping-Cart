// Functions
function addOne(element = numItem, val = 1) {
	element.innerText = Number(element.innerText) + val;
}
function minusOne(element = numItem, val = 1) {
	if (element.innerText > 0)
		element.innerText = Number(element.innerText) - val;
}
function gets(element) {
	return document.querySelectorAll(element);
}
function get(element) {
	return document.querySelector(element);
}
function toggleClass(className, element_To_Toggle) {
	element_To_Toggle.classList.toggle(className);
}
function toggleState(item_to_toggle, [...items_to_be_clicked], toggleAction) {
	document.addEventListener("click", (e) => {
		clickedItem = e.target;
		items_to_be_clicked.forEach((item) => {
			if (clickedItem == item) {
				toggleAction(clickedItem);
			}
		});
	});
}
function getNewPath(clickedItem) {
	if (clickedItem.classList.contains("thumbnail")) {
		return clickedItem.getAttribute("src").replace("-thumbnail", "");
	}
}
function changeSource(currentItem, newPath) {
	currentItem.setAttribute("src", newPath);
}
function updatethumbnails(newThumbnail, location = "body") {
	let oldthumbnails = gets(location + " .current_thumbnail");
	oldthumbnails.forEach((thumbnail) => {
		toggleClass("current_thumbnail", thumbnail);
	});

	let newThumbnailClass = newThumbnail.classList[1];
	let newThumbnails = gets(`${location} .${newThumbnailClass}`);
	newThumbnails.forEach((thumbnail) => {
		toggleClass("current_thumbnail", thumbnail.parentNode);
	});
}

/*   Sidebar toggle visibility   */
let sideBarIcon = gets(".nav .icons-menu");
let sideBar = get(".nav_middle");
let sideBarCloseIcon = gets(".nav_middle_inner .icons-close");
toggleState(sideBar, sideBarIcon, () => {
	toggleClass("in_view", sideBar);
});
toggleState(sideBar, sideBarCloseIcon, () => {
	toggleClass("in_view", sideBar);
});

/*   CartMenu toggle visibility   */
let cartIcon = gets(".nav .icons-cart");
let cartMenu = get(".nav .cart_menu");
toggleState(cartMenu, cartIcon, () => {
	toggleClass("hidden", cartMenu);
	toggleClass("pressed", cartIcon[0]);
});

/*   Number of item toggle increase or decrease */
let numItem = get(".current_quantity");
let minusIcon = gets(".icons-minus");
let plusIcon = gets(".icons-plus");
toggleState(numItem, plusIcon, () => {
	addOne();
});
toggleState(numItem, minusIcon, () => {
	minusOne();
});

/*   Switch current Images via thumbnails  */
let currentImages = gets(".current_image");
let altImages = gets(".container_body .thumbnail");

toggleState(currentImages, altImages, (clickedItem) => {
	let newPath = getNewPath(clickedItem);
	currentImages.forEach((currentImage) => {
		changeSource(currentImage, newPath);
	});
	updatethumbnails(clickedItem);
});

let currentBackground = get(".picture_in_view");

// generate srcs from thumnails
let thumbnails = gets(".thumbnail");
let imgSrcs = [];
thumbnails.forEach((thumbnail) => {
	imgSrcs.push(thumbnail.getAttribute("src").replace("-thumbnail", ""));
	imgSrcs = imgSrcs.splice(0, 4);
});

// toggle directionIcon clicks
let nextIcons = gets(".container_body .icons-next");
let prevIcons = gets(".container_body .icons-previous");
toggleState(currentImages, nextIcons, () => {
	// if nextIcons is clicked, take current image to next image in list
	currentImages.forEach((image) => {
		let newPath = imgSrcs[(imgSrcs.indexOf(image.getAttribute("src")) + 1) % 4];
		changeSource(image, newPath);
	});
});

toggleState(currentImages, prevIcons, () => {
	// preveious Icon is clicked, take current image to previous
	// image in list;
	currentImages.forEach((image) => {
		let index = imgSrcs.indexOf(image.getAttribute("src")) - 1;
		index = index == -1 ? 3 : index;
		let newPath = imgSrcs[index];
		changeSource(image, newPath);
	});
});

/*   Set toggles for lightBox independently */
let currentLightboxImage = get(".lightbox .current_image");
let lightboxNexIcons = gets(".lightbox .icons-next");
let lightboxPrevIcons = gets(".lightbox .icons-previous");

toggleState(currentLightboxImage, lightboxNexIcons, () => {
	let newPath =
		imgSrcs[
			(imgSrcs.indexOf(currentLightboxImage.getAttribute("src")) + 1) % 4
		];
	changeSource(currentLightboxImage, newPath);
});

toggleState(currentLightboxImage, lightboxPrevIcons, () => {
	let index = imgSrcs.indexOf(currentLightboxImage.getAttribute("src")) - 1;
	index = index == -1 ? 3 : index;
	let newPath = imgSrcs[index];
	changeSource(currentLightboxImage, newPath);
});

/*  change by thumbnail click */
let lightboxaltImages = gets(".lightbox .thumbnail");

toggleState(currentLightboxImage, lightboxaltImages, (clickedItem) => {
	let newPath = getNewPath(clickedItem);
	changeSource(currentLightboxImage, newPath);
	updatethumbnails(clickedItem, ".lightbox ");
});

/*   Close lightbox   */
let closeBtn = gets(".lightbox .icons-close");
let lightbox = get(".lightbox");
toggleState(lightbox, closeBtn, () => {
	toggleClass("hidden", lightbox);
});

/*   open lightbox  */
mainCurrentImage = get(".container_body .current_image");
toggleState(lightbox, [mainCurrentImage], () => {
	toggleClass("hidden", lightbox);
});

/*   Cart item add and count   */
let addToCartBtn = gets(".carts-btn");
let cartItem = get(".cart_item");
let cartItemCount = 0;
let itemCounter = get(".cart_item_count");
let cartEmptyNotice = get(".cart_menu_notice");
let cartMenuContent = get(".cart_menu_content");
let cartItemDeleteBtn = [null];
let itemIdNumber = 0;

// when add to cartbtn is clicked
toggleState(cartMenu, addToCartBtn, () => {
	// create new cartItem from template;
	newCartItem = cartItem.cloneNode(true);

	// fill in details: quantity, current price, and total price;
	// get currentQuantity
	let itemQuantity = get(".current_quantity").innerText;
	newCartItem.querySelector(".cart_item_quantity").innerText = itemQuantity;
	let unitPrice = Number.parseFloat(
		get(".selling_price").innerText.slice(1)
	).toFixed(2);
	newCartItem.querySelector(".unit_price").innerText = "$" + unitPrice;
	newCartItem.querySelector(".total_price").innerText =
		"$" + (itemQuantity * unitPrice).toFixed(2);

	// add itemNumber id to cart;
	newCartItem.classList.add(`cartId-${++itemIdNumber}`);
	newCartItem.querySelectorAll(".icons-delete").forEach((icon) => {
		icon.classList.add(`cartId-${itemIdNumber}`);
	});
	if (itemQuantity > 0) {
		// add to cart menu. only if quantity > 0;
		cartMenuContent.appendChild(newCartItem);
		cartItemCount += 1;

		// display counter
		if (cartItemCount > 0) {
			itemCounter.innerText = cartItemCount;
			itemCounter.classList.remove("hidden");
			cartEmptyNotice.classList.add("hidden");
		}
	}
});

/*  Cart Item delete  */
cartMenuContent.addEventListener("click", (e) => {
	let itemclicked = e.target;
	if (
		itemclicked.classList.value.includes("cartId") &&
		itemclicked.classList.value.includes("icons-delete")
	) {
		let idNum = itemclicked.classList.value.search(/cartId-\d/);
		idNum = itemclicked.classList.value.substr(idNum, 9);
		cartMenuContent.querySelector("." + idNum).remove();
		cartItemCount -= 1;
		itemCounter.innerText = cartItemCount;
		if (cartItemCount == 0) {
			cartEmptyNotice.classList.remove("hidden");
			itemCounter.classList.add("hidden");
			itemIdNumber = 0;
		}
	}
});
