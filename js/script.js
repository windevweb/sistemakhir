// Initialize Supabase Client
const supabaseUrl = 'https://eyzvqdknrkkjznqvmxgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5enZxZGtucmtranpucXZteGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0OTc1NzksImV4cCI6MjA1NDA3MzU3OX0.v-3bKrF431br9SKSXPzUOHU-f4CW_4SAgtSic502sbs';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch and Display Documents
async function fetchDocuments() {
    try {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }
  
      const documentGrid = document.getElementById('documentGrid');
      documentGrid.innerHTML = ''; // Clear existing cards
  
      data.forEach(doc => {
        const statusIcon = doc.status === 'Acc' 
          ? '<i class="fas fa-check-circle icon-status text-success"></i>' 
          : '<i class="fas fa-exclamation-circle icon-status text-warning"></i>';
  
        const card = `
          <div class="col">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h5 class="card-title fw-bold">${doc.title}</h5>
                <p class="card-text text-muted">${doc.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="badge ${doc.status === 'Acc' ? 'bg-success' : 'bg-warning'} text-white">
                    ${statusIcon} Revisi ${doc.status}
                  </span>
                  <a href="${doc.url}" class="btn btn-primary btn-sm" target="_blank">Lihat Dokumen</a>
                </div>
              </div>
            </div>
          </div>
        `;
        documentGrid.innerHTML += card;
      });
    } catch (err) {
      console.error('Error in fetchDocuments:', err);
    }
  }

// Handle Form Submission
document.getElementById('documentForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get Form Data
  const title = document.getElementById('documentTitle').value;
  const description = document.getElementById('documentDescription').value;
  const status = document.getElementById('documentStatus').value;
  const url = document.getElementById('documentUrl').value;

  try {
    // Insert Data into Supabase
    const { data, error } = await supabaseClient
      .from('documents')
      .insert([{ title, description, status, url }])
      .single();

    if (error) {
      console.error('Error inserting data:', error);
      alert('Gagal menambahkan dokumen. Silakan coba lagi.');
    } else {
      alert('Dokumen berhasil ditambahkan!');
      document.getElementById('documentForm').reset();
      fetchDocuments(); // Refresh the document list
    }
  } catch (err) {
    console.error('Error in form submission:', err);
  }
});

// Search Functionality
document.getElementById('searchButton').addEventListener('click', function () {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('#documentGrid .card');

  cards.forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    if (title.includes(searchQuery)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// Load Documents on Page Load
document.addEventListener('DOMContentLoaded', fetchDocuments);