export const getDuration = (text) => {
	const duration = text.length / 1000;
	const duerationInMinutes = Math.floor(duration);
	const duerationInSeconds = Math.round(60 * (duration - duerationInMinutes));
	return `${duerationInMinutes} мин ${duerationInSeconds} сек`;
}

export const getPlotText = (plot) => {
	let text = "";
	plot.chapters.forEach(chapter => {
		text += chapter.content;
	});
	return text;
}