
// Add a space to start and end of string
// Returns string with spaces
function addSpaces(str) {
	return ' '+str+' ';
}

// Get the poem's author
// Returns a string
function getPoemAuthor(poem) {

	var poem = jQuery.parseXML(this.text);
	var author = jQuery(poem).find('author')[0];
	
	return jQuery(author).text();
}

// Get the poem's title
// Returns a string
function getPoemTitle(poem) {

	var poem = jQuery.parseXML(this.text);
	var title = jQuery(poem).find('title')[0];
	
	return jQuery(title).text();
}


// Check if text is a preposition
// Returns boolean
function isPreposition(text) {
		
	var replacements = new Array('', 'the', 'an', 'a', 'for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'after', 'although', 'as', 'if', 'though', 'because', 'before', 'even', 'if', 'only', 'in', 'now', 'once', 'rather', 'since', 'that', 'than', 'though', 'till', 'unless', 'until', 'when', 'whenever', 'where', 'whereas', 'wherever', 'while', 'also', 'both', 'not', 'either', 'neither ', 'whether', 'at', 'on', 'however', 'by', 'my', 'some', 'over', 'with', 'i', 'he', 'she', 'it', 'they', 'you', 'we', 'they', 'them', 'theirs', 'themselves', 'us', 'ours', 'ourselves', 'him', 'her', 'it', 'his', 'hers', 'its', 'himself', 'herself', 'itself', 'your', 'yourself', 'me', 'myself', 'of', 'thy', 'is');
	
	text = jQuery.trim(text.toLowerCase());
	
	for (var i=0; i<replacements.length; i++) {
		if (text == replacements[i]) {
			return true;
		}
	}
	
	return false;
	
}

// Check if text is a word
// Returns boolean
function isWord(text) {
	
	if (text.match(/\w/)){
		return true;
	}
	else {
		return false;
	}
	
}


// Get the words and punctuation of a line
// Returns an array of word and punctuation objects
function getLineWords(line) {

	// Compress spaces
	var line = this.text.replace(/\s+/g, ' ');
	
	var cuts = line.split(' ');
	
	var parts = [];
	
	var partsCount = 0;
	var wordCount = 0;
	var punctuationCount = 0;
	
	for (k=0; k<cuts.length; k++) {
		
		// Identify punctuation at start or end of text and add spaces around it
		var bits = cuts[k].replace(/^([^\w\s]|_)|([^\w\s]|_)$/g, addSpaces);
		
		// Compress spaces
		bits = bits.replace(/\s+/g, ' ');
		
		var pieces = jQuery.trim(bits).split(' ');
		
		for (e=0; e<pieces.length; e++) {
			if (isWord(pieces[e])) {
				parts[partsCount] = new Word(jQuery.trim(pieces[e]), this.ref+'word'+wordCount, partsCount);
				if (isPreposition(pieces[e])) {
					parts[partsCount].image = false;
				}
				else {
					parts[partsCount].image = true;
				}
				wordCount++;
			}
			else {
				parts[partsCount] = new Punctuation(jQuery.trim(pieces[e]), this.ref+'punctuation'+punctuationCount, partsCount);
				punctuationCount++;
			}
			partsCount++;
			poem.count++;
		}
		
	}	
	
	return parts;
	
}


// Get the lines of a poem
// Returns an array of line objects
function getPoemLines(poem) {
	
	var lines = jQuery(this.text).find('line');
	
	for (i=0; i<lines.length; i++) {
	    lines[i] = new Line(jQuery.trim(jQuery(lines[i]).text()), this.ref+'line'+i);
	}
	return lines;
}

// Get the stanzas of a poem
// Returns an array of stanza objects
function getPoemStanzas(poem) {

	var poem = jQuery.parseXML(this.text);
	var stanzas = jQuery(poem).find('stanza');
	
	for (u=0; u<stanzas.length; u++) {
	    stanzas[u] = new Stanza(jQuery(stanzas[u]), this.ref+'stanza'+u);
	}
	return stanzas;
}

// Get the navigation menu for a word
// Returns a HTML object
function getWordNav() {

	var nav = new wordNav(this.ref+'nav');
	return nav;
	
}


function Photo(farm, server, id, secret, size) {

	this.farm = farm;
	this.server = server;
	this.id = id;
	this.secret = secret;
	this.size = size;

	return true;

}


// Get an image for a word
// Returns true on success and adds source to image object via wordImage.
function getWordImages() {
	
	var word = this;
	
	
	
	if (poem.images) {
		
		var photos;
	
		var imagearray = (poem.images).split(',');
	
		var theimage = imagearray[word.num];
		
		theimage = theimage.replace('http://farm', '');
		theimage = theimage.replace('.static.flickr.com/', '_');
		theimage = theimage.replace('/', '_');
		theimage = theimage.replace('.jpg', '');
		
		
	
		var photoDetails = theimage.split('_');
		var photo = new Photo(photoDetails[0], photoDetails[1], photoDetails[2], photoDetails[3], photoDetails[4]);
		photos = photo;
	}
	

	var tag = this.text;
	var path = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=4b061797cb4461989b0de3ae153c1e96&tags="'+encodeURIComponent(tag)+'"&sort=relevance&safe_search=1&content_type=1&tag_mode=all&per_page=10&page=1';	
	
	var request = jQuery.getJSON(path+"&format=json&jsoncallback=?");

	request.done(function(data) {		

		if (data.photos.photo.length > 0) {
			console.log(data.photos);
			//photos.push(data.photos);
			
			if (photos) {
				Array.prototype.unshift.call(data.photos.photo, photos);
			}    
			word.image.photos = data.photos;
			word.image.photoNum = 0;
			wordImage(word.image, word.image.photos.photo[0]);
			
			return true;
			
		}
		else {
			
			wordError(word.image);
			return false;
				
		}
		
	});
	
	
}


function changeImage() {

 word.photos.photo[i];

}

function wordImage(image, photo) {	

	var imagesrc = "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+image.size+".jpg";
	image.src = imagesrc;
	
	var line = image.parentNode.parentNode;
	var word = image.parentNode;
	var text = jQuery(word).find('.text')[0];
	
	//word.style.display = 'inline-block';
	//word.style.float = 'inline-block';
	
	jQuery(image).load(function() {
		
		image.className = 'photo '+(image.size).replace('_', 'size-');
	

		//~ text.style.position = 'absolute';
		//~ var textwidth = jQuery(text).width() + 20;
		//~ text.style.position = 'relative';
		
		//~ var imagewidth = jQuery(image).width();
		
		//~ if (textwidth > imagewidth && image.size == '_t') {
		
			//~ console.log(jQuery(text).text() +' - textwidth:  '+ jQuery(text).width());
				//~ console.log(image.size);
				//~ console.log('imagewidth: ' + imagewidth);
			
				//var enlarge = jQuery(image.parentNode).find('.enlargeimage')[0];
				//enlarge.click();
				
				//image.className = 'photo '+(image.size).replace('_', 'size-')+' fit';
				//jQuery(image).addClass('lrg');
				//jQuery(image).width(textwidth);
		//~ }

			//~ console.log('lineheight-'+lineheight);
			//~ console.log(imageheight + 35 + 12);
			//~ if (lineheight > (imageheight + 35 + 12)) {
				
			//~ }

			//~ var maxheight = 0;
			//~ var maxheightspill = 0;

			//~ var words = jQuery(line).find('.word');
			//~ for (t=words.length-1; t>=0; t--) {
				
				//~ words[t].style.marginTop = '0';
				//~ var wordheight = jQuery(words[t]).height();
				
				//~ if (wordheight > maxheight) {
					//~ var lineheight = jQuery(line).height();
					//~ var linepaddingtop = (jQuery(line).css('padding-top')).replace('px', '');
					//~ var lineoffset = jQuery(line).offset();
					//~ var wordoffset = jQuery(words[t]).offset();
					//~ if (wordoffset.top-linepaddingtop > lineoffset.top) {
						//~ console.log('yes1');
					//~ }
					//~ else {
						//~ maxheight = wordheight;
					//~ }
				//~ }
			
			//~ }        
			
			//~ var linepaddingtop = (jQuery(line).css('padding-top')).replace('px', '');
			//~ var lineoffset = jQuery(line).offset();
             
			//~ for (u=0; u<words.length; u++) {
		
				//~ var wordheight = jQuery(words[u]).height();
				//~ var wordmargin = maxheight-wordheight;
			
				//~ if (maxheight > wordheight) {
					//~ words[u].style.marginTop = wordmargin+'px';
				//~ }
				
				//~ var lineheight = jQuery(line).height();
				//~ var wordoffset = jQuery(words[u]).offset();
				//~ if ((lineheight > maxheight+12) && (wordoffset.top-wordmargin-linepaddingtop > lineoffset.top)) {
					//~ if (wordheight > maxheightspill) {                  
						//~ maxheightspill = wordheight;
					//~ }
				//~ }
			
			//~ }
			
			
			
			//~ var maxheightoverspill = 0;
						
			//~ for (v=0; v<words.length; v++) {
					
				//~ var wordheight = jQuery(words[v]).height();
				//~ var wordoffset = jQuery(words[v]).offset();
				//~ var wordmargin = maxheight-wordheight;
				//~ var lineheight = jQuery(line).height();
			
				//~ if ((lineheight > maxheight+12) && (wordoffset.top-wordmargin-linepaddingtop > lineoffset.top)) {
						//~ console.log(jQuery(jQuery(words[v]).find('.text')[0]).text());
						//~ console.log(wordoffset.top);
						//~ console.log(lineoffset.top);						
						//~ words[v].style.marginTop = (maxheightspill-wordheight)+'px';
						
					//~ }

			//~ }        
			
			//~ for (p=words.length-1; p>=0; p--) {
					
				//~ var wordheight = jQuery(words[p]).height();
				//~ var wordoffset = jQuery(words[p]).offset();
				//~ var wordmargin = maxheight-wordheight;
				//~ var lineheight = jQuery(line).height();
			
				//~ if ((lineheight > maxheight+12) && (wordoffset.top-wordmargin-linepaddingtop > lineoffset.top)) {
						//~ console.log(jQuery(jQuery(words[p]).find('.text')[0]).text());
						//~ words[p].style.marginTop = (maxheightspill-wordheight)+'px';
					
					//~ }

			//~ }        

			//~ if (lineheight > maxheight+12) {

					//~ console.log('lo '+lineoffset.top);
					//~ console.log('mgt '+(maxheight-wordheight));
					//~ console.log('lh '+lineheight);
					//~ console.log('mh '+maxheight);
					//~ console.log(jQuery(jQuery(words[u]).find('.text')[0]).text());
				
				//~ for (v=0; v<words.length; v++) {
					
					//~ var wordheight = jQuery(words[v]).height();
					//~ var wordoffset = jQuery(words[v]).offset();
					//~ var wordmargin = maxheight-wordheight;
					
					//~ if ((wordoffset.top-wordmargin-linepaddingtop) > lineoffset.top) {
						
						//~ console.log(jQuery(jQuery(words[v]).find('.text')[0]).text());
						
						//~ if (wordheight > maxheightspill) {                  
							//~ maxheightspill = wordheight;
						//~ }
							
						//~ console.log('max - '+maxheightspill);
					
						//~ console.log(wordoffset.top-wordmargin-linepaddingtop);
						//~ console.log(lineoffset.top);
						//~ words[v].style.marginTop = (maxheightspill-wordheight)+'px';
			
					//~ }
					
					
				
						//~ //words[v].style.marginTop = (maxheightspill-spillheight)+'px';
				//~ }        
						
					
				
			//~ }
          
			//~ var punctuations = jQuery(line).find('.punctuation');
			//~ for (r=0; r<punctuations.length; r++) {
				
				//~ var punctuationheight = jQuery(punctuations[r]).height();
				
				//~ if (maxheight > (punctuationheight)) {
					//~ punctuations[r].style.marginTop = (maxheight - (punctuationheight))+'px';
				//~ }
				//~ else {
					//~ punctuations[r].style.marginTop = '0';
				//~ }
				
				//~ var punctuationoffset = jQuery(punctuations[r]).offset();
				//~ var lineheight = jQuery(line).height();
				
				//~ if ((lineheight > maxheight+12) && (punctuationoffset.top-linepaddingtop > lineoffset.top)) {
					//~ punctuations[r].style.marginTop = (maxheightspill-punctuationheight)+'px';
				//~ }
				
			//~ }      
			
			var loading = jQuery(image.parentNode).find('.loading')[0];
	
			jQuery(loading).hide();
	
			
		
	});
	
	return true;

}

function wordError(image) {	

	var word = image.parentNode;
	
	var loading = jQuery(word).find('.loading')[0];
	jQuery(loading).hide();
	
	var nav = jQuery(word).find('.nav')[0];
	jQuery(nav).remove();
	
	jQuery(image).remove();
	
	word.className += ' preposition';
	
	return true;

}


function imageResize() {
	
	
	var image = this;
	

	

}

function resizeImage() {

	var nav = this;
	var navImage = jQuery(navItem).find('img')[0];
	var imageLink = navItem.parentNode.parentNode;
	var image = jQuery(imageLink).find('.flickrimg')[0];

if (image.photoSize == 'm') {
image.photoSize = 'l';
jQuery(navImage).attr('src', 'http://www.digipoem.co.uk/images/med.jpg');
advanceImage(image, image.photoNum, '');
}
else {
image.photoSize = 'm';
jQuery(navImage).attr('src', 'http://www.digipoem.co.uk/images/large.jpg');
advanceImage(image, image.photoNum, "_m");
}
image.style.width = 'auto';
image.style.height= 'auto';
image.parentNode.parentNode.style.height = 'auto';
return false;
}

function changeImage() {

	var nav = this;
	var action = nav.className;
	var word = nav.parentNode.parentNode;
	var image = jQuery(word).find('.photo')[0];
	var loading = jQuery(word).find('.loading')[0];
	
	switch (action) {
		
		case 'nextimage':
			if (image.photoNum < image.photos.photo.length-1) {
				jQuery(loading).show();
				image.photoNum++;
				wordImage(image, image.photos.photo[image.photoNum], image.photoSize);
			}
			else {
				return false;
			}
		break;
			
		case 'previmage':
			if (image.photoNum > 0){
				jQuery(loading).show();
				image.photoNum--;
				wordImage(image, image.photos.photo[image.photoNum], image.photoSize);
			}
			else {
				return false;
			}
		break;
		
		case 'enlargeimage':
			
			jQuery(loading).show();
			
			var reduceImage = jQuery(nav.parentNode).find('.reduceimage')[0];
			jQuery(reduceImage).show();
			
			var size = image.size;
			
			if (size == '_t') {
				image.size = '_m';
				//image.style.height = '150px';
			}
			else {
				image.size = '';
				image.style.height = 'auto';
				var enlargeImage = jQuery(nav.parentNode).find('.enlargeimage')[0];
				jQuery(enlargeImage).hide();
			}
			
			wordImage(image, image.photos.photo[image.photoNum], image.size);
			
		break;
		
		case 'reduceimage':
			
			jQuery(loading).show();
			
			var enlargeImage = jQuery(nav.parentNode).find('.enlargeimage')[0];
			jQuery(enlargeImage).show();
			
			var size = image.size;
			
			if (size == '') {
				image.size = '_m';
				//image.style.height = '150px';
			}
			else {
				image.size = '_t';
				image.style.height = 'auto';
				var reduceImage = jQuery(nav.parentNode).find('.reduceimage')[0];
				jQuery(reduceImage).hide();
			}
			
			wordImage(image, image.photos.photo[image.photoNum], image.size);
			
		break;
		
		default:
		return false;
	
	}

	return false;

}

function loadingImage(image) {	
	
	image.src = "http://www.digipoem.co.uk/images/load.gif";	
	
	return;

}

function getWordSize() {
	

}

function noImage(word) {	
	
	jQuery('#'+word.ref+' img').remove();
	jQuery('#'+word.ref).attr('class', 'punctuation'); 
	return;

}

function Punctuation(text, ref, num) {

	this.text = text;
	this.type = 'punctuation';
	this.num = num;
	
	this.ref = ref;
	
	this.html = getPoemHtml;	

	return true;

}

function poemNav() {

	this.type = 'nav';
	
	this.ref = ref;
	
	this.html = getNavHtml;	

	return true;
	
}

function wordNav(ref) {

	this.type = 'nav';
	
	this.ref = ref;
	
	this.html = getNavHtml;

	return true;
	
}

function Word(text, ref, num) {

	this.text = text;
	this.type = 'word';
	
	this.num = num;
	this.ref = ref;
	this.photos;
	this.photoNum;
	this.image;
	
	this.size = getWordSize;
	this.images = getWordImages;	
	this.nav = getWordNav;	
	this.html = getPoemHtml;	

	return true;
}

function Line(text, ref) {	

	this.text = text;
	this.type = 'line';
	
	this.ref = ref;
	
	this.words = getLineWords;	
	this.html = getPoemHtml;
	
	return true;
	
}

function Stanza(text, ref) {

	this.text = text;
	this.type = 'stanza';
	
	this.ref = ref;
	
	this.lines = getPoemLines;
	this.html = getPoemHtml;	
	
	return true;



}

function Poem(text, ref) {	

	this.text = text;
	this.type = 'poem';
	this.images;
	this.ref = ref || 'poem'+0;
	this.count = 0;
	
	this.stanzas = getPoemStanzas;
	this.html = getPoemHtml;	
	this.author = getPoemAuthor;
	this.title = getPoemTitle;
	return true;
	
}




function makeNav (href, type, image, alt) {
						
	var nav = document.createElement("a");
	nav.href = href;
	nav.className = type;
	
	var navImage = new Image();
	navImage.src = image;
	navImage.alt = alt;
						
	nav.appendChild(navImage);
	
	return nav;
						
}


function getNavHtml() {
	
	if (this.type == 'nav') {
	
		var element = document.createElement('div');
		element.setAttribute('id', this.ref);
		element.className = this.type;
		jQuery(element).hide();
			
		var prev = makeNav('#', 'previmage', 'http://www.digipoem.co.uk/images/arrow-l.png', 'Previous image');
		jQuery(prev).click(changeImage);
		element.appendChild(prev);
		
		var next = makeNav('#', 'nextimage', 'http://www.digipoem.co.uk/images/arrow-r.png', 'Next image');
		jQuery(next).click(changeImage);
		element.appendChild(next);
		
		
		var reduce = makeNav('#', 'reduceimage', 'http://www.digipoem.co.uk/images/med.jpg', 'Reduce image');
		jQuery(reduce).click(changeImage);
		jQuery(reduce).hide();
		element.appendChild(reduce);
		
		var enlarge = makeNav('#', 'enlargeimage', 'http://www.digipoem.co.uk/images/large.jpg', 'Enlarge image');
		jQuery(enlarge).click(changeImage);
		element.appendChild(enlarge);
		
		//var loading = makeNav('#', 'loadingimage', 'http://www.dudeyjon.com/digipoem/images/loading.jpg', 'Loading...');
		//element.appendChild(loading);
	}
	
	return element;
	
}


function imageOver() {
	var nav = jQuery(this).find('.nav');
	jQuery(nav).fadeIn('fast');
}

function imageOut() {
	var nav = jQuery(this).find('.nav');
	jQuery(nav).hide();
}

function makeLoading() {
	
	var loading = new Image();
	loading.src = "/img/loading.gif";	
	loading.className = 'loading';
	loading.alt = 'Loading...';
	
	return loading;
	
}


function getPoemHtml() {
	
	if (this.type == 'punctuation') {
	
		var element = document.createElement('span');
		element.className = this.type;
		var punctuation = document.createElement('span');
		punctuation.appendChild(document.createTextNode(this.text));
		punctuation.className = 'text';
		element.setAttribute('id', this.ref);
		element.appendChild(punctuation);	
		
	}
	
	if (this.type == 'word') {
	
		var element = document.createElement('span');
		element.className = this.type;
		element.setAttribute('id', this.ref);		
		jQuery(element).hover(imageOver, imageOut);
		
		var word = document.createElement('span');
		word.appendChild(document.createTextNode(this.text));
		word.className = 'text';
		
		if (this.image) {		
			
			element.appendChild(makeLoading());
			var nav = this.nav();
			element.appendChild(nav.html());
			
			this.image = new Image;
			this.image.className = 'photo';
			this.image.photoNum = 0;
			this.image.size = '_t';
			//this.image.style.height = '150px';
			element.appendChild(this.image);			
			
			this.images();	
				
		}
		else {
			element.className += ' preposition';
		}
	
		element.appendChild(word);	
		
	}
	if (this.type == 'line') {
		var element = document.createElement('div');

		element.setAttribute('id', this.ref);
		
		var words = this.words();
		for (x=0; x<words.length; x++) {
			element.appendChild(words[x].html());
		}
		element.className = this.type;
	}
	
	if (this.type == 'stanza') {
		var element = document.createElement('div');
		element.setAttribute('id', this.ref);
		var lines = this.lines();
		for (z=0; z<lines.length; z++) {
			element.appendChild(lines[z].html());
		}
		element.className = this.type;
	}
	
	
	if (this.type == 'poem') {
		var element = document.createElement('div');
		element.setAttribute('id', this.ref);
		
		//~ var heading = document.createElement('h2');
		//~ heading.className = 'title';
		//~ heading.appendChild(document.createTextNode(this.title()));
		//~ element.appendChild(heading);
		
		var stanzas = this.stanzas();
		for (y=0; y<stanzas.length; y++) {
			element.appendChild(stanzas[y].html());
		}
		element.className = this.type;
	}
	if (this.type == 'wordImage') {
		jQuery(imageLink).click(imageBlink);
	}

	return element;

}


function sharePoem() {

var poem = document.getElementById('poem0');
var poemcopy = poem.cloneNode(true);

openSend('sendpoem.html', '_blank', sendPoem.innerHTML);

}


function openSend(url, name, sendPoem) {
window.sendPoem = sendPoem;
var newwindow=window.open(url, name, 'toolbar=0,scrollbars=yes,location=0,statusbar=0,menubar=0,resizable=yes,width=800,height=500,left=50,top=50,titlebar=yes');
if (window.focus) {newwindow.focus()}
}








function inlinePoemCSS(original) {

	var copy = original.cloneNode(true);
	copy.id = 'poemPreview';
	jQuery(copy).removeAttr('class');
	
	//~ var title = jQuery(copy).find('.title')[0];
	//~ jQuery(title).removeAttr('class');
	//~ jQuery(title).css({
		//~ 'font': '1.6em georgia, serif',
		//~ 'color': '#141414',
		//~ 'padding': '0 10px 15px 10px'
	//~ });
	
	var poem = jQuery(copy).find('.poem');
	for (y=0; y<poem.length; y++) {
	
		var poemwidth = jQuery(jQuery(original).find('.poem')[y]).width();
		console.log(poemwidth);
		
		jQuery(poem[y]).removeAttr('class');
		jQuery(poem[y]).css({
			'display': 'block',
			'overflow': 'hidden',
			'margin': '10px',
			'padding': '25px 10px 0 10px',
			'border-width': '1px',
			'border-style': 'solid', 
			'border-color': '#F0F0F0',
			'background-color': '#F5F5F5',
			'width': poemwidth
		});
	}
	
	var stanza = jQuery(copy).find('.stanza');
	for (t=0; t<stanza.length; t++) {
		jQuery(stanza[t]).removeAttr('class');
		jQuery(stanza[t]).css({
			'display': 'block',
			'margin-bottom': '30px',
			'padding': '0',
			'border-width': '1px',
			'border-style': 'solid', 
			'border-color': '#F0F0F0',
			'background-color': '#F0F0F0'		
		});
	}
	
	var line = jQuery(copy).find('.line');
	for (u=0; u<line.length; u++) {
		jQuery(line[u]).removeAttr('class');
		jQuery(line[u]).css({
			'display': 'block',
			'overflow': 'hidden',
			'margin-bottom': '1px',
			'padding': '15px 15px 5px 15px',
			'clear': 'both',
			'background-color': '#fdfdfd'		
		});
	}
	
	var word = jQuery(copy).find('.word');
	for (i=0; i<word.length; i++) {
			
		var wordmargin = jQuery(word[i]).css('margin-top');
	
		jQuery(word[i]).find('.nav').remove();
		jQuery(word[i]).find('.loading').remove();
		
		jQuery(word[i]).css({
			'overflow': 'hidden',
			'width': 'auto',
			'height': 'auto',
			'float': 'none',
			'display': 'inline-block',
			'padding': '0',
			'margin': '0',
			'padding-right': '10px',
			'padding-bottom': '10px'
		});

		var image = jQuery(word[i]).find('img')[0];
		if (jQuery(image).hasClass('size-m')) {
			//~ jQuery(image).css({
				//~ 'height': '125px'  
			//~ });
			//~ jQuery(image).attr('height', '125');
		}
		jQuery(image).removeAttr('class');
		jQuery(image).css({
			'display': 'block',    
			'margin': '0 auto',
			'padding': '0',
			'width': 'auto',
			'border-width': '1px',
			'border-style': 'solid', 
			'border-color': '#333333',
			'border-bottom': 'none'
		});
		jQuery(image).load(function() {
			//var height = jQuery(image).height();
			//console.log(jQuery(image).height());
			//jQuery(image).attr('height', height);
		});
	
		
		
		if (jQuery(word[i]).hasClass('preposition')) {
			
			jQuery(word[i]).removeAttr('style');
			
			jQuery(word[i]).css({
				'overflow': 'hidden',
				'width': 'auto',
				'height': 'auto',
				'float': 'none',
				'display': 'inline-block',
				'padding': '0',
				'margin': '0',
				'padding-right': '10px',
				'padding-bottom': '10px'
			});
		
			var prepositiontext = jQuery(word[i]).find('.text')[0];
			
			jQuery(prepositiontext).removeAttr('class');
			jQuery(prepositiontext).removeAttr('style');
			
			jQuery(prepositiontext).css({
				'font': '1em georgia, serif',
				'background-color': '#141414',   
				'color': 'white',
				'display': 'block',
				'margin':  '0',
				'padding': '10px 10px 10px 10px',
				'border-width': '1px',
				'border-style': 'solid',
				'border-color': '#333333',
				'text-align': 'left'
			});
		
		}
		
		var wordtext = jQuery(word[i]).find('.text')[0];
		jQuery(wordtext).removeAttr('class');
		jQuery(wordtext).css({
			'font': '1em georgia, serif',
			'background-color': '#141414',   
			'color': 'white',
			'display': 'block',
			'margin':  '0',
			'padding': '10px',
			'text-align': 'left',
			'border-width': '1px',
			'border-style': 'solid', 
			'border-color': '#333333'
		});
		
		
		jQuery(word[i]).removeAttr('class');

	}
	
	var punctuation = jQuery(copy).find('.punctuation');
	for (r=0; r<punctuation.length; r++) {
	
		var punctuationmargin = jQuery(punctuation[r]).css('margin-top');
		
		jQuery(punctuation[r]).removeAttr('class');
		jQuery(punctuation[r]).css({
			'overflow': 'hidden',
			'width': 'auto',
			'height': 'auto',
			'float': 'none',
			'display': 'inline-block',
			'padding': '0',
			'margin': '0',
			'padding-right': '10px',
			'padding-bottom': '10px'
		});
		
		var punctuationtext = jQuery(punctuation[r]).find('.text')[0];
		jQuery(punctuationtext).removeAttr('class');
		jQuery(punctuationtext).css({
			'font': '1em georgia, serif',
			'background-color': '#141414',   
			'color': 'white',
			'display': 'block',
			'margin':  '0',
			'padding': '10px 10px 10px 10px',
			'border-width': '1px',
			'border-style': 'solid', 
			'border-color': '#333333',
			'text-align': 'left'
		});

	}
	
	return copy;
	
}



function cleanPoemCSS(original) {

	var copy = original.cloneNode(true);
	
	var poem = document.createElement('div');
	poem.appendChild(copy);
	
	var word = jQuery(poem).find('.word');
	for (i=0; i<word.length; i++) {
	
		jQuery(word[i]).find('.nav').remove();
		jQuery(word[i]).find('.loading').remove();

	}
	
	return poem;
	
}



function requestHaiku() {

	//var url = 'http://www.dudeyjon.com/digipoem/restapiproxy.php?csurl=' + encodeURIComponent(path);
	var path = 'http://www.randomhaiku.com/haiku.php';
	var request = jQuery.getJSON(path+"?xsl=json");

	request.complete(function(data) {		
console.log(data);
		if (data) {
				
			var poem = new Poem(data);
			var poemHtml = poem.html();
			jQuery('#content').append(poemHtml);
						
		
			
		}
		else {
			
			return false;
				
		}
		
	});
	

}



