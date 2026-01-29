import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { ordersAPI } from '../../services/api';

const statusColors = {
  Pending: 'warning',
  Cutting: 'info',
  Sewing: 'primary',
  Ready: 'success',
  Delivered: 'default',
  Cancelled: 'error'
};

const Orders = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    start: null,
    end: null
  });

  const { data: ordersData, isLoading, refetch } = useQuery(
    ['orders', page, rowsPerPage, search, statusFilter, dateFilter],
    () => ordersAPI.getOrders({
      page: page + 1,
      limit: rowsPerPage,
      search,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      startDate: dateFilter.start,
      endDate: dateFilter.end
    })
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.deleteOrder(id);
        toast.success('Order deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleExport = () => {
    // Export logic here
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Orders Management
        </Typography>
        <Typography color="text.secondary">
          Manage all customer orders and track their progress
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">
                {ordersData?.pagination?.totalItems || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4" color="warning.main">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ৳ 45,250
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Due Amount
              </Typography>
              <Typography variant="h4" color="error.main">
                ৳ 12,500
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    select
                    fullWidth
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Cutting">Cutting</MenuItem>
                    <MenuItem value="Sewing">Sewing</MenuItem>
                    <MenuItem value="Ready">Ready</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="From Date"
                    value={dateFilter.start || ''}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      start: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="To Date"
                    value={dateFilter.end || ''}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      end: e.target.value
                    }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterIcon />}
                      onClick={() => {/* Clear filters */}}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  All Orders
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/orders/create')}
                >
                  New Order
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Advance</TableCell>
                      <TableCell>Due</TableCell>
                      <TableCell>Delivery Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersData?.data?.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {order.orderId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {order.itemName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {order.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="medium">
                            ৳ {order.totalAmount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="success.main">
                            ৳ {order.advancePaid}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color={order.dueAmount > 0 ? "error.main" : "success.main"}>
                            ৳ {order.dueAmount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(new Date(order.deliveryDate), 'dd/MM/yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={statusColors[order.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/orders/${order._id}`)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/orders/edit/${order._id}`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(order._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Print Invoice">
                              <IconButton size="small">
                                <PrintIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={ordersData?.pagination?.totalItems || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Orders;
