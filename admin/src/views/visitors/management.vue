<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Register</strong> <small>new visitor</small>
        </CCardHeader>
        <CCardBody>
          <CAlert
            color="success"
            :visible="successAlert"
            dismissible
            @close="
              () => {
                successAlert = false
              }
            "
          >
            {{ successMessage }}</CAlert
          >
          <CAlert
            color="warning"
            :visible="errorAlert"
            dismissible
            @close="
              () => {
                errorAlert = false
              }
            "
          >
            {{ errorMessage }}</CAlert
          >
          <CInputGroup class="mb-3">
            <CFormSelect
              v-model="selectedOption"
              aria-label="Default select example"
            >
              <option>Select</option>
              <option value="vehicle">Vehicle</option>
              <option value="walk-in">Walk-in</option>
            </CFormSelect>
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CFormInput
              v-model="firstname"
              placeholder="Firstname"
              aria-label="FirstName"
            />
            <CFormInput
              v-model="lastname"
              placeholder="Lastname"
              aria-label="Lastname"
            />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CFormInput
              v-model="contact"
              placeholder="Contact"
              aria-label="Contact"
            />
          </CInputGroup>
          <CInputGroup class="mb-3">
            <CFormTextarea
              v-model="purpose"
              placeholder="Purpose"
              aria-label="Purpose"
            />
          </CInputGroup>
          <CCol :xs="12">
            <CButton @click="registerVisitor" color="dark" type="submit">
              Submit form
            </CButton>
          </CCol>
        </CCardBody>
      </CCard>
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Dashboard</strong> <small>statistics & check out</small>
        </CCardHeader>
        <CCardBody>
          <CAlert
            color="success"
            :visible="successTAlert"
            dismissible
            @close="
              () => {
                successTAlert = false
              }
            "
          >
            {{ successMessage }}</CAlert
          >
          <CAlert
            color="warning"
            :visible="errorTAlert"
            dismissible
            @close="
              () => {
                errorTAlert = false
              }
            "
          >
            {{ errorMessage }}</CAlert
          >
          <CInputGroup class="mb-3">
            <CFormInput
              v-model="filterValue"
              placeholder="Search"
              aria-label="Search"
            />
          </CInputGroup>
          <CTable>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('firstName')"
                  :class="{ sortable: sortKey === 'firstName' }"
                >
                  First Name
                  <span v-if="sortKey === 'firstName'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('lastName')"
                  :class="{ sortable: sortKey === 'lastName' }"
                >
                  Last Name
                  <span v-if="sortKey === 'lastName'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('contact')"
                  :class="{ sortable: sortKey === 'contact' }"
                >
                  Contact
                  <span v-if="sortKey === 'contact'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('purpose')"
                  :class="{ sortable: sortKey === 'purpose' }"
                >
                  Purpose
                  <span v-if="sortKey === 'purpose'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('vehicleOrWalk')"
                  :class="{ sortable: sortKey === 'vehicleOrWalk' }"
                >
                  Vehicle/Walk-in
                  <span v-if="sortKey === 'vehicleOrWalk'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  scope="col"
                  @click="sortTable('status')"
                  :class="{ sortable: sortKey === 'status' }"
                >
                  Status
                  <span v-if="sortKey === 'status'" class="sort-arrow">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </CTableHeaderCell>
                <CTableHeaderCell scope="col">Action </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow
                v-for="(visitor, index) in paginatedVisitors"
                :key="index"
              >
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>{{ visitor.firstName }}</CTableDataCell>
                <CTableDataCell>{{ visitor.lastName }}</CTableDataCell>
                <CTableDataCell>{{ visitor.contact }}</CTableDataCell>
                <CTableDataCell>{{ visitor.purpose }}</CTableDataCell>
                <CTableDataCell>{{ visitor.vehicleOrWalk }}</CTableDataCell>
                <CTableDataCell>
                  {{ getStatusLabel(visitor.status) }}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    @click="updateVisitor(visitor.transactionId)"
                    color="warning"
                    :disabled="visitor.status === 0"
                  >
                    OUT
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CPagination align="end" aria-label="Page navigation example">
            <CPaginationItem
              v-if="currentPage !== 1"
              @click="goToPage(currentPage - 1)"
            >
              Previous
            </CPaginationItem>
            <CPaginationItem
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :active="page === currentPage"
            >
              {{ page }}
            </CPaginationItem>
            <CPaginationItem
              v-if="currentPage !== totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Next
            </CPaginationItem>
          </CPagination>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Tables',
  data() {
    return {
      firstname: '',
      lastname: '',
      contact: '',
      purpose: '',
      selectedOption: '',
      visitors: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: '',
      sortOrder: 'asc',
      filterValue: '',
      successAlert: false,
      successTAlert: false,
      successMessage: '',
      errorAlert: false,
      errorTAlert: false,
      errorMessage: '',
    }
  },
  methods: {
    async registerVisitor() {
      this.checkAuthTimeout()
      const config = this.createAuthConfig()
      try {
        const formData = {
          firstName: this.firstname,
          lastName: this.lastname,
          contact: this.contact,
          purpose: this.purpose,
          selectedOption: this.selectedOption,
        }
        const response = await axios.post('/v1/api', formData, config)
        this.retrieveVisitor()
        this.currentPage = 1
        this.successAlert = true
        this.successMessage = response.data.message
      } catch (error) {
        this.errorAlert = true
        this.errorMessage =
          'Registration failed, ' + error.response.data.errors[0].message
      }
    },
    async retrieveVisitor() {
      const config = this.createAuthConfig()
      try {
        const response = await axios.get('/v1/api', config)
        if (response.data.records.length > 0) {
          this.visitors = response.data.records
        }
        this.currentPage = 1
      } catch (error) {
        console.error('API error:', error)
      }
    },
    async updateVisitor(id) {
      this.checkAuthTimeout()
      const config = this.createAuthConfig()
      try {
        const formData = {
          transactionId: id,
          status: 0,
        }
        const response = await axios.put('/v1/api', formData, config)
        this.retrieveVisitor()
        this.currentPage = 1
        this.successTAlert = true
        this.successMessage = response.data.message
      } catch (error) {
        this.errorTAlert = true
        this.errorMessage = 'Failed to updated a visitor'
        console.error('API error:', error.message)
      }
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }

      this.visitors.sort((a, b) => {
        const modifier = this.sortOrder === 'desc' ? -1 : 1
        if (a[key] < b[key]) return -1 * modifier
        if (a[key] > b[key]) return 1 * modifier
        return 0
      })
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    ...mapActions(['checkAuthenticationTimeout']),
    async checkAuthTimeout() {
      await this.checkAuthenticationTimeout()
      if (!this.isAuthenticated) {
        this.$router.push('/pages/login')
        alert('session is already over. please relogin first')
      }
    },
    createAuthConfig() {
      const clientId = process.env.VUE_APP_FE_CLIENT_ID
      const clientSecret = process.env.VUE_APP_FE_CLIENT_SECRET

      return {
        headers: {
          'X-Client-Id': clientId,
          'X-Client-Secret': clientSecret,
          'Content-Type': 'application/json',
        },
      }
    },
  },
  created() {
    this.retrieveVisitor()
    this.checkAuthTimeout()
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    getStatusLabel() {
      return (status) => (status === 1 ? 'IN' : 'OUT')
    },
    filteredVisitors() {
      if (!this.filterValue) {
        return this.visitors
      }

      const searchTerm = this.filterValue.toLowerCase()

      return this.visitors.filter(
        (visitor) =>
          visitor.firstName.toLowerCase().includes(searchTerm) ||
          visitor.lastName.toLowerCase().includes(searchTerm) ||
          visitor.contact.toLowerCase().includes(searchTerm) ||
          visitor.purpose.toLowerCase().includes(searchTerm) ||
          visitor.vehicleOrWalk.toLowerCase().includes(searchTerm) ||
          this.getStatusLabel(visitor.status)
            .toLowerCase()
            .includes(searchTerm),
      )
    },
    paginatedVisitors() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredVisitors.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredVisitors.length / this.itemsPerPage)
    },
  },
}
</script>
