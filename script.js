import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function disappear(target) {
	let x = document.querySelector(target);
	await animate(x, { opacity: 0 }, { duration: 0.2 }).then(() => {
		x.style.display = "none";
		x.style.userSelect = "none";
		x.style.pointerEvents = "none";
	});
}

document.querySelector("#foreground button").addEventListener("click", () => {
	disappear("#foreground");
});

let inputs = document.getElementsByClassName("text");
function updateAnimations() {
	document.querySelector("#balls").innerHTML = "";
	for (let i = 0; i < inputs.length; i++) {
		let x = inputs[i].getAttribute("order");
		let y = document.createElement("div");
		let a = 5;
		let colours = ["#59dafb", "#ffb439", "#da609e", "#c2d94c"];
		y.classList.add("ball");
		y.style.background = colours[i];
		inputs[i].addEventListener("input", (event) => {
			let z = event.target.value;
			if (/cubic-bezier*/.test(z)) {
				console.log("True");
				z = z.replace("cubic-bezier(", "");
				z = z.replace(")", "");
				// z = z.split(",");
				z = "[" + z + "]";
				console.log(z);
			}
			localStorage.setItem(x, z);
		});
		y.addEventListener("click", async () => {
			animate(
				y,
				{ translateX: 950 },
				{
					duration: a,
					repeat: 1,
					repeatType: "reverse",
					ease: localStorage.getItem(x),
				}
			);
			await sleep(a * 1000).then(() => {
				let c = setInterval(() => {
					let b = document.createElement("div");
					let d = new DOMMatrix(window.getComputedStyle(y).transform).m41;
					console.log(d);
					b.classList.add("circle");
					b.style.background = colours[i];
					b.style.opacity = "20%";
					b.style.transform = `translateX(${d.toString()}px)`;
					b.style.top = y.getBoundingClientRect().top + "px";
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
		"order",
		event.target.previousElementSibling.getAttribute("order") + 1
	);
	x.classList.add("text");
	event.target.parentNode.insertBefore(x, event.target);
}

document.querySelector("#addClown").addEventListener("click", (event) => {
	moreClowns(event);
	updateAnimations();
});

updateAnimations();
