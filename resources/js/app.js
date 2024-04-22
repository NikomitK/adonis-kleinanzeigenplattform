import.meta.glob(['../images/**'])
import.meta.glob(['../images/icons/**'])

window.saveListing = function saveListing(id) {
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
            console.log(error);
        });
}

window.unsaveListing = function unsaveListing(id) {
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
            console.log(error);
        });
} 
