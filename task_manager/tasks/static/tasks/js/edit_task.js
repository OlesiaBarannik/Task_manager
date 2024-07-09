$(document).ready(function() {
    // Function to handle inline editing of project names
    function handleEditButtonClick() {
        const row = $(this).closest('tr');

        const taskName = row.find('td:eq(0)').text().trim();
        const editInputTaskName = $('<input>', {
            type: 'text',
            value: taskName,
            class: 'form-control'
        });
        row.find('td:eq(0)').html(editInputTaskName);

        const taskStatus = row.find('td:eq(1)').text().trim();
        const selectTaskStatus = $('<select>', {
            class: 'form-control'
        }).append(
            $('<option>', { value: 'pending', text: 'Pending' }).prop('selected', taskStatus === 'pending'),
            $('<option>', { value: 'in_progress', text: 'In Progress' }).prop('selected', taskStatus === 'in_progress'),
            $('<option>', { value: 'done', text: 'Done' }).prop('selected', taskStatus === 'done')
        );
        row.find('td:eq(1)').html(selectTaskStatus);



        const taskDeadline =  row.find('td:eq(2)').text().trim();
        const editInputTaskDeadline = $('<input>', {
            type: 'date',
            value: taskDeadline,
            class: 'form-control'
        });
        row.find('td:eq(2)').html(editInputTaskDeadline);


        const taskPriority = row.find('td:eq(3)').text().trim();
        const editInputTaskPriority = $('<input>', {
            type: 'number',
            value: taskPriority,
            class: 'form-control'
        });
        row.find('td:eq(3)').html(editInputTaskPriority);

        // Replace "Edit" button with "Save" button
        const saveButton = $('<button>', {
            class: 'btn btn-sm mb-2 save-btn',
            html: '<i class="fas fa-save"></i>'
        });
        $(this).replaceWith(saveButton);


        // Handle Save button click to save changes
        saveButton.click(function() {
            const newInputTaskName = editInputTaskName.val().trim();
            const newInputTaskStatus = selectTaskStatus.val().trim();
            const newInputTaskDeadline = editInputTaskDeadline.val().trim();
            const newInputTaskPriority = editInputTaskPriority.val().trim();

            const csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
            const url = window.location.href + row.find('td:eq(5)').text().trim();

            const data = {
                name: newInputTaskName,
                status: newInputTaskStatus,
                deadline: newInputTaskDeadline,
                priority:newInputTaskPriority
            };

            console.log(data)
            $.ajax({
                url: url,
                type: 'PATCH',
                headers: {
                    'X-CSRFToken': csrftoken,
                },
                data: JSON.stringify(data),
                success: function(response) {
                    console.log(response);
                    row.find('td:eq(0)').text(newInputTaskName);
                    row.find('td:eq(1)').text(newInputTaskStatus);
                    row.find('td:eq(2)').text(newInputTaskDeadline);
                    row.find('td:eq(3)').text(newInputTaskPriority);

                    saveButton.replaceWith($('<button>', {
                        class: 'btn btn-sm mb-2 edit-btn',
                        html: '<i class="fas fa-pencil-alt"></i>'
                    }).click(handleEditButtonClick));

                    sortTableByPriority()
                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });

        });
    }

    function addEventHandlers() {
        // Attach the click handler to all edit buttons
        $('#tasksTable').on('click', '.edit-btn', handleEditButtonClick);
    }

    addEventHandlers();
});
