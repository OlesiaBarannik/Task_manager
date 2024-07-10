$(document).ready(function() {
    $('#taskForm').submit(function(event) {
        event.preventDefault();  // Запобігаємо стандартній відправці форми
        const formData = {
            name: $('#task-name').val(),
            status: $('#task-status').val(),
            deadline: $('#task-deadline').val(),
            priority: $('#task-priority').val()
        };
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: JSON.stringify(formData),  // Конвертуємо дані у формат JSON
            contentType: 'application/json',  // Вказуємо тип контенту
            headers: {
                'X-CSRFToken': '{{ csrf_token }}'  // Встановлюємо CSRF токен
            },
            success: function(data) {
                // Обробка успішного відповіді
                const newRow = `
                    <tr>
                        <td>${data.name}</td>
                        <td>${data.status}</td>
                        <td>${data.deadline}</td>
                        <td>${data.priority}</td>
                        <td style="text-align: right;">
                            <button class="btn btn-sm mb-2 edit-btn"><i class="fas fa-pencil-alt"></i></button>
                            <button class="btn btn-sm mb-2 del-btn" onclick="delete_task(this, '${data.id}')"><i class="fas fa-trash"></i></button>
                        </td>
                        <td hidden>${data.id}</td>
                    </tr>
                `;
                $('#tasksTable tbody').append(newRow);
                $('#taskForm')[0].reset();  // Скидаємо поля форми після успішної відправки
                sortTableByPriority()
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});
