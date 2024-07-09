$(document).ready(function() {
    // Function to handle inline editing of project names
    function handleEditButtonClick() {
        const row = $(this).closest('tr');
        const projectId = row.find('.project-id').text().trim(); // Fetch project ID from the hidden <td>
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
            class: 'btn btn-success btn-sm save-btn',
            html: '<i class="fas fa-save"></i> Save'
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

                $.ajax({
                    url: `/projects/${projectId}/`,
                    type: 'PATCH',
                    headers: {
                        'X-CSRFToken': csrftoken,
                    },
                    data: {
                        'new_name': newName,
                    },
                    success: function(response) {
                        console.log(response);
                        row.find('td:eq(1)').text(newName); // Update the UI with new name
                        saveButton.replaceWith($('<button>', {
                            class: 'btn btn-primary btn-sm edit-btn',
                            html: '<i class="fas fa-pencil-alt"></i> Edit'
                        }).click(handleEditButtonClick));
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            } else {
                // Replace "Save" button back to "Edit" button without saving
                saveButton.replaceWith($('<button>', {
                    class: 'btn btn-primary btn-sm edit-btn',
                    html: '<i class="fas fa-pencil-alt"></i> Edit'
                }).click(handleEditButtonClick));
            }
        });
    }

    function addEventHandlers() {
        // Attach the click handler to all edit buttons
        $('#projectsTable').on('click', '.edit-btn', handleEditButtonClick);
    }

    addEventHandlers();

    // Form submission handler
    $('#projectForm').submit(function(event) {
        event.preventDefault();  // Prevent default form submission

        const formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: formData,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'
            },
            success: function(data) {
                // Assuming the response is JSON with the new project data
                console.log(data);
                const newRow = `
                    <tr>
                        <td class="project-id" scope="row">${data.id}</td>
                        <td>${data.name}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-btn">
                                <i class="fas fa-pencil-alt"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm delete-btn">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
                const $newRow = $(newRow);
                $('#projectsTable tbody').append($newRow);

                // Attach the edit button handler to the new row
                $newRow.find('.edit-btn').click(handleEditButtonClick);

                $('#projectForm')[0].reset();  // Reset form fields after successful submission
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});
