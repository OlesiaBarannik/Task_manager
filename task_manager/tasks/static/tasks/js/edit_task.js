$(document).ready(function() {
    // Function to handle inline editing of project names
    function handleEditButtonClick() {
        const row = $(this).closest('tr');
        const projectId = row.find('.project-id').text().trim();
        const currentName = row.find('td:eq(1)').text().trim();

        // Create an input field for editing inline
        const editInput = $('<input>', {
            type: 'text',
            value: currentName,
            class: 'form-control'
        });

        // Replace the project name cell with the input field
        row.find('td:eq(1)').html(editInput);

        // Replace "Edit" button with "Save" button
        const saveButton = $('<button>', {
            class: 'btn btn-sm mb-2 save-btn',
            html: '<i class="fas fa-save"></i>'
        });
        $(this).replaceWith(saveButton);

        // Focus on the input field
        editInput.focus();

        // Handle Save button click to save changes
        saveButton.click(function() {
            const newName = editInput.val().trim();
            if (newName && newName !== currentName) {
                // Fetch CSRF token
                const csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                const url = `/projects/${projectId}/`

                const data = {
                    project: newName  // Отримуємо значення з поля вводу
                };

                $.ajax({
                    url: url,
                    type: 'PATCH',
                    headers: {
                        'X-CSRFToken': csrftoken,
                    },
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log(response);
                        row.find('td:eq(1)').text(newName); // Update the UI with new name
                        saveButton.replaceWith($('<button>', {
                            class: 'btn btn-sm mb-2 edit-btn',
                            html: '<i class="fas fa-pencil-alt"></i>'
                        }).click(handleEditButtonClick));
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            } else {
                // Replace "Save" button back to "Edit" button without saving
                saveButton.replaceWith($('<button>', {
                    class: 'btn btn-sm mb-2 edit-btn',
                    html: '<i class="fas fa-pencil-alt"></i>'
                }).click(handleEditButtonClick));
            }
        });
    }

    function addEventHandlers() {
        // Attach the click handler to all edit buttons
        $('#projectsTable').on('click', '.edit-btn', handleEditButtonClick);
    }

    addEventHandlers();
});
