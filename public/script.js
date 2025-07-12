let counter = 0

document.querySelector(".content button").addEventListener( "click", async (e) => {
    e.preventDefault()
    
    const message = document.querySelector('#message').value.trim()

    if (message === '') {
        alert("Please enter a message")
        return
    } try {
        counter += 1

        const response = await fetch('/api/laporan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    })

    const data = await response.json()
    alert(data.message);


    } catch (error) {
        console.error('Error:', error)
        alert('Terjadi kesalahan saat mengirim laporan!')
    }
})