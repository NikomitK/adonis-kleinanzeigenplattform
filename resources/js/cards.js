function saveListing(id) {
    console.log('clicked');
    fetch(`/anzeige/${id}/save`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.status == 200 ? location.reload() : console.log('error');
        }).catch(error => {
            console.log('error');
        });
}

function unsaveListing(id) {
    console.log('clicked');
    fetch(`/anzeige/${id}/unsave`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.status == 200 ? location.reload() : console.log('error');
        }).catch(error => {
            console.log('error');
        });
} 