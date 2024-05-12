
export const tabBrowserSetting = (routeTitle) => {

	let link = document.querySelector("link[rel~='icon']");

	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	link.href = 'https://webinarinc-central.s3.us-west-1.amazonaws.com/public/company_logo/revdojo_favicon.ico'

	let title = routeTitle
		? 'RevDojo' + ' | ' + routeTitle
		: 'RevDojo';

	document.title = title;
};
