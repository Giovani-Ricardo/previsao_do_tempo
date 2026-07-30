const url = "http://localhost:3000/event_date"

fetch(url, {
    method: "GET"
}).then( (res) => {
    const json = res.json();
    console.log(json)
    json.then( (data) => {
        let eventDate = new Date(data.eventDate);
        console.log(data)
        setInterval(() => updateCountdown(eventDate), 1000);
    })
});

function updateCountdown(eventDate){
    const currentDate = new Date();

    const difference = eventDate - currentDate;
    if (difference <= 0) {
        const counterRow = document.getElementById("counter-row");
        counterRow.classList.remove('text-white');
        counterRow.classList.add('text-success');
        return;
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
}