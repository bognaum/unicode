import symbolModalWindow from "./symbol-modal-window.js";
import _                 from "./settings.js";
import {
	eHTML,
	getParentLine,
	selectElement,
	clearSelection,
} from "./util.js";
import {
	articleAPI,
	sidebarAPI,
} from "./rendering.js";



font_fam.value = getComputedStyle(document.body).fontFamily;
font_indicator.textContent = getComputedStyle(font_indicator).fontFamily;



// Events ↓

document.body.onclick = function h_BodyClick(e) {

	let t = e.target;
	do {
		if (t.classList.contains("block-num-line")) {
			articleAPI.setOnTop(t.dataset.blockNum * _.blockLength / _.rowLength);
		} else 
		if (t.classList.contains("smw-close-btn")) {
			symbolModalWindow.close();
		} else 
		if (t.classList.contains("smw-copy-symbol-btn")) {
			selectElement(document.querySelector(".smw-symbol"));
			document.execCommand("copy");
			setTimeout(clearSelection, 500);
		} else
		if (t.classList.contains("smw-googling-symbol-btn")) {
			var 
				symbol = document.querySelector(".smw-symbol").textContent,
				url = `https://www.google.com/search?q=${encodeURIComponent(symbol)}`,
				a = eHTML(`<a target="_blank" href="${url}">#</a>`);
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
		} else
		if (t.classList.contains("smw-previous-symbol-btn")) {
			var 
				mWin   = document.querySelector(".symbol-modal-window"),
				num    = mWin.dataset.number * 1,
				prev   = (0 < num)? num - 1 : num,
				rowNum = prev     ? Math.floor(prev / _.rowLength) : 0;
			symbolModalWindow.open(prev);
			articleAPI.setOnMiddle(rowNum);
		} else
		if (t.classList.contains("smw-next-symbol-btn")) {
			var 
				mWin   = document.querySelector(".symbol-modal-window"),
				num    = mWin.dataset.number * 1,
				next   = num + 1,
				rowNum = Math.floor(next / _.rowLength);
			symbolModalWindow.open(next);
			articleAPI.setOnMiddle(rowNum);
		} else 
		if (t.id == "search_img_gliph") {
			var input = document.querySelector("#search_field");
			document.body.onchange({target: input});
		} else 
			continue;
		break;

	} while (t = t.parentElement);


	if (e.target.classList.contains("selectable")) {

		selectElement(e.target);
		document.execCommand("copy");
		setTimeout(clearSelection, 500);
	}

	if (e.target.classList.contains("smw-glass-cower")) {
		symbolModalWindow.close();
	} else if (e.target.classList.contains("open-smw")) {
		var
			cell = getParentLine(e.target).find((v) => v.dataset.charNum !== undefined),
			num = cell.dataset.charNum * 1;
		symbolModalWindow.open(num);
	}

	if (e.target.classList.contains('set-font-list-item')) {
		font_fam.value = ''+e.target.textContent+'';
		_.fontStyle.fontFamily = font_fam.value;
		updateFontCss();
		// console.log(`e.target.textContent`, e.target.textContent);
	}
}

document.body.onchange = function h_BodyChange(e) {
	var t = e.target;
	if (t.classList.contains("update-fonts")) {

		if (t == text_decor)
			_.fontStyle.textDecoration = t.value;
		else
		if (t == font_bold)
			_.fontStyle.fontWeight = t.checked ? "bold" : "normal";
		else
		if (t == font_italic)
			_.fontStyle.fontStyle = t.checked ? "italic" : "normal";
		else
		if (t == font_fam)
			_.fontStyle.fontFamily = t.value;
		
		updateFontCss()
	} else
	if (t == search_field) {
		let v = e.target.value, num;

		if (!v) 
			return;
		
		if (v.charCodeAt() !== v.codePointAt()) {
			console.log("surrogate pare");
			num = v.codePointAt();
		} else if (v.length == 1) {
			console.log(`(v.length == 1)`);
			num = v.charCodeAt();
		} else if (v.startsWith("%u")) {
			console.log(`(v.startsWith("%u"))`);
			num = parseInt("0x"+v.slice(2));
		} else if (v.startsWith("%")) {
			console.log(`(v.startsWith("%")`);
			num = decodeURIComponent(v).charCodeAt();
		} else if (num = v * 1) {
			console.log(`(num = v * 1)`);
			num;
		} else {
			console.error("(!)-USER'S ", "'num' is not defined.\nnum : '"+num+"'");
		}

		let rowNum = Math.floor(num / _.rowLength);
		symbolModalWindow.open(num);
		articleAPI.setOnMiddle(rowNum);

		t.select();
	}
}

document.querySelector("#sidebar").onwheel = function h_kNumWheel(e) {
	e.preventDefault();
	this.scrollTop += Math.sign(e.deltaY) * 35;
}

function updateFontCss() {
	const str = `
		.stylized {
			text-decoration: ${_.fontStyle.textDecoration};
			font-weight: ${_.fontStyle.fontWeight};
			font-style: ${_.fontStyle.fontStyle};
			font-family: ${_.fontStyle.fontFamily};
		}
	`;
	font_style_css.textContent = str;
	font_indicator.textContent = getComputedStyle(font_indicator).fontFamily;
	// document.head.appendChild(font_style_css);
	symbolModalWindow.setSymbolHeightData();
}

// Events ⭡



