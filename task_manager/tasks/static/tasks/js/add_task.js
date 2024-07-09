$(document).ready(function() {
    $('#projectForm').submit(function(event) {
        event.preventDefault();  // Запобігаємо стандартній відправці форми
        const formData = {
            project: $('#project').val()  // Отримуємо значення з поля вводу
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
                        <td class="project-id">${data.id}</td>
                        <td>${data.name}</td>
                        <td>
                            <button class="btn btn-sm mb-2 edit-btn"><i class="fas fa-pencil-alt"></i></button>
                            <button class="btn btn-sm mb-2 del-btn"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-sm mb-2" onclick="location.href='${data.id}/tasks'"><i class="fas fa-info-circle"></i></button>
                        </td>
                    </tr>
                `;
                $('#projectsTable tbody').append(newRow);
                $('#projectForm')[0].reset();  // Скидаємо поля форми після успішної відправки
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    });
});
