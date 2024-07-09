function delete_task(button, task_id) {

    const url = window.location.href + task_id;

    var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();

    $.ajax({
        type: 'DELETE',
        url: url,
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function(response) {
             $(button).closest('tr').remove();
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}



