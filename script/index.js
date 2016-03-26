$(function() {
	$("#tabForm").tab({
		name: "tabForm",
		isEdit: false
	});

	$("#editTab").tab({
		name: "tabEdit",
		max: 10,
		isEdit: true
	});
});