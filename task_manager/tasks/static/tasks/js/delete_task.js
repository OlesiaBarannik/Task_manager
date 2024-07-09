$(document).ready(function() {
    // Attach click event handler to buttons with class 'del-btn'
    $(document).on('click', '.del-btn', function() {
        var projectId = $(this).closest('tr').find('.project-id').text().trim();

        // Fetch CSRF token
        var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();

        $.ajax({
            type: 'DELETE',
            url: `/projects/${projectId}/`,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(response) {
                // Remove the deleted project row from the table
                $(`#projectsTable tbody tr:contains(${projectId})`).remove();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});


