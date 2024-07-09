  $(document).ready(function() {
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
          console.log(data)
          const newRow = `
            <tr>
              <td scope="row">${data.id}</td>
              <td>${data.name}</td>
              <td>
                <button class="btn btn-primary btn-sm">
                    <i class="fas fa-pencil-alt"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
            </tr>
          `;
          $('#projectsTable tbody').append(newRow);
          $('#projectForm')[0].reset();  // Reset form fields after successful submission
        },
        error: function(error) {
          console.error('Error:', error);
        }
      });
    });
  });

