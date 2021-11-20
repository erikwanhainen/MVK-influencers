import axios from "axios";

export function toDateString(date) {
	let day = date.getDate();
	let month = date.getMonth() + 1;
	const year = date.getFullYear();
	if (day.toString().length === 1) {
		day = "0" + day;
	}
	if (month.toString().length === 1) {
		month = "0" + month;
	}
	return year + "-" + month + "-" + day;
}

export async function createList(type, start, end) {
	let res = await axios.get(
		"http://ec2-3-81-166-212.compute-1.amazonaws.com/api/v1/" +
			"getLedamot" +
			"?startdate=" +
			toDateString(start) +
			"&enddate=" +
			toDateString(end) +
			"&type=" +
			type
	);

	let list = [];
	let i = 0;
	for (const person of res.data) {
		list[i] = {
			value: person.person_id,
			label: person.namn,
			party: person.parti,
		};
		i++;
	}
	return list;
}
