import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function disappear(target, instant) {
	let x = document.querySelector(target);
	if (instant) {
		x.style.display = "none";
		x.style.userSelect = "none";
		x.style.pointerEvents = "none";
	} else {
		await animate(x, { opacity: 0 }, { duration: 0.2 }).then(() => {
			x.style.display = "none";
			x.style.userSelect = "none";
			x.style.pointerEvents = "none";
		});
	}
}

if (localStorage.getItem("noIntro") === "true") {
	disappear("#foreground", true);
} else if (localStorage.getItem("noIntro") === null) {
	document.querySelector("#foreground button").addEventListener("click", () => {
		disappear("#foreground", false);
	});
} else {
	document.querySelector("#foreground button").addEventListener("click", () => {
		disappear("#foreground", false);
	});
}

let inputs = document.getElementsByClassName("text");
function updateAnimations() {
	document.querySelector("#balls").innerHTML = "";
	for (let i = 0; i < inputs.length; i++) {
		let x = inputs[i].getAttribute("data-order");
		let y = document.createElement("div");
		let a = 5;
		let colours = [
			"#59dafb",
			"#ffb439",
			"#da609e",
			"#c2d94c",
			"#52bed9",
			"#a169be",
		];
		y.classList.add("ball");
		y.style.background = colours[i];
		inputs[i].style.border = `2px solid ${colours[i]}`;
		inputs[i].style.borderRadius = "3px";
		inputs[i].addEventListener("input", (event) => {
			let z = event.target.value;
			if (/cubic-bezier*/.test(z)) {
				console.log("True");
				z = z.replace("cubic-bezier(", "");
				z = z.replace(")", "");
				z = z.split(",");
				for (let i = 0; i < z.length; i++) {
					z[i] = parseFloat(z[i]);
				}
				console.log(z);
				localStorage.setItem(x, z);
				console.log(localStorage.getItem(x));
			}
			// if (z.includes("-")) {
			// 	z = z.split("-");
			// 	for (let i = 0; i < z.length; i++) {
			// 		if (z === "-") {
			// 			let i = z.indexOf("-");
			// 			if (i > -1) {
			// 				z.splice(i, 1);
			// 			}
			// 		}
			// 		z[i] = String(z[i]).charAt(0).toUpperCase() + String(z[i]).slice(1);
			// 	}
			// }
			localStorage.setItem(x, z);
		});
		y.addEventListener("click", async () => {
			let ease = localStorage.getItem(x);
			if (ease.includes(",")) {
				ease = ease.split(",");
				for (let i = 0; i < ease.length; i++) {
					ease[i] = parseFloat(ease[i]);
				}
			}
			for (let i = 0; i <= 15; i++) {
				if (y.nextElementSibling === null) {
				} else if (y.nextElementSibling.classList.contains("circle")) {
					y.nextElementSibling.remove();
				}
			}
			animate(
				y,
				{ translateX: 950 },
				{
					duration: a,
					repeat: 1,
					repeatType: "reverse",
					ease: ease,
				}
			);
			await sleep(a * 1000).then(() => {
				let c = setInterval(() => {
					let b = document.createElement("div");
					let d = new DOMMatrix(window.getComputedStyle(y).transform).m41;
					console.log(d);
					b.classList.add("circle");
					b.style.opacity = "20%";
					b.style.transform = `translateX(${d.toString()}px)`;
					b.style.top = y.getBoundingClientRect().top + "px";
					y.style.background = colours[i];
					// if (i > colours.length - 1) {
					// 	do {
					// 		i = i - colours.length;
					// 	} while (i > colours.length - 1);
					// 	b.style.background = colours[i];
					// } else {
					// 	b.style.background = colours[i];
					// }
					y.parentNode.insertBefore(b, y.nextSibling);
				}, (a / 16) * 1000);
				setTimeout(() => {
					clearInterval(c);
				}, a * 1000);
			});
		});
		document.querySelector("#balls").appendChild(y);
		// y.setProperty("order", x);
	}
}

function moreClowns(event) {
	let x = document.createElement("input");
	x.setAttribute(
		"data-order",
		(
			parseFloat(
				event.target.previousElementSibling.getAttribute("data-order")
			) + 1
		).toString()
	);
	x.classList.add("text");
	if (localStorage.getItem(x.getAttribute("data-order")) != null) {
		x.value = localStorage.getItem(x.getAttribute("data-order"));
	}
	event.target.parentNode.insertBefore(x, event.target);
}

document.querySelector("#addClown").addEventListener("click", (event) => {
	if (document.getElementsByClassName("ball").length >= 6) {
		window.alert(
			"Woah there. You can't focus on more than six balls at a time, can you?"
		);
		console.error("Only six balls permitted.");
		return;
	}
	moreClowns(event);
	updateAnimations();
});

document.querySelector("#play").addEventListener("click", () => {
	for (let i = 0; i < document.getElementsByClassName("ball").length; i++) {
		document
			.getElementsByClassName("ball")
			[i].dispatchEvent(new Event("click"));
	}
});

document.querySelector("#noIntro").addEventListener("click", () => {
	localStorage.setItem("noIntro", "true");
	disappear("#foreground", false);
});

updateAnimations();
