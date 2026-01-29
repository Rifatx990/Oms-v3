import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const steps = ['Customer Details', 'Order Details', 'Measurements', 'Payment'];

const validationSchema = Yup.object({
  customerName: Yup.string().required('Customer name is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  itemName: Yup.string().required('Item name is required'),
  quantity: Yup.number().min(1, 'Minimum 1 quantity').required('Quantity is required'),
  measurements: Yup.string().required('Measurements are required'),
  totalAmount: Yup.number().min(0, 'Amount must be positive').required('Total amount is required'),
  advancePaid: Yup.number().min(0, 'Advance must be positive')
});

const OrderForm = ({ initialValues, onSubmit, isLoading }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [workers, setWorkers] = useState([]);

  const formik = useFormik({
    initialValues: initialValues || {
      customerName: '',
      phone: '',
      address: '',
      itemName: '',
      quantity: 1,
      measurements: '',
      notes: '',
      totalAmount: 0,
      advancePaid: 0,
      status: 'Pending',
      deliveryDate: new Date(Date.now() + 86400000),
      assignedWorker: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        toast.success('Order saved successfully');
      } catch (error) {
        toast.error('Failed to save order');
      }
    }
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleWorkerChange = (event) => {
    formik.setFieldValue('assignedWorker', event.target.value);
  };

  const calculateDue = () => {
    const total = formik.values.totalAmount || 0;
    const advance = formik.values.advancePaid || 0;
    return total - advance;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                helperText={formik.touched.customerName && formik.errors.customerName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Delivery Date"
                  value={formik.values.deliveryDate}
                  onChange={(date) => formik.setFieldValue('deliveryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Cutting">Cutting</MenuItem>
                <MenuItem value="Sewing">Sewing</MenuItem>
                <MenuItem value="Ready">Ready</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="itemName"
                value={formik.values.itemName}
                onChange={formik.handleChange}
                error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                helperText={formik.touched.itemName && formik.errors.itemName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes/Special Instructions"
                name="notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Measurements"
                name="measurements"
                multiline
                rows={4}
                value={formik.values.measurements}
                onChange={formik.handleChange}
                error={formik.touched.measurements && Boolean(formik.errors.measurements)}
                helperText={formik.touched.measurements && formik.errors.measurements}
                placeholder="Chest: 40", Waist: 32", Length: 42" etc."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Assign to Worker"
                name="assignedWorker"
                value={formik.values.assignedWorker}
                onChange={handleWorkerChange}
              >
                <MenuItem value="">None</MenuItem>
                {workers.map((worker) => (
                  <MenuItem key={worker._id} value={worker._id}>
                    {worker.name} ({worker.workType})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Amount (৳)"
                name="totalAmount"
                value={formik.values.totalAmount}
                onChange={formik.handleChange}
                error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
                helperText={formik.touched.totalAmount && formik.errors.totalAmount}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Advance Paid (৳)"
                name="advancePaid"
                value={formik.values.advancePaid}
                onChange={formik.handleChange}
                error={formik.touched.advancePaid && Boolean(formik.errors.advancePaid)}
                helperText={formik.touched.advancePaid && formik.errors.advancePaid}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Due Amount (৳)"
                value={calculateDue()}
                disabled
                InputProps={{
                  sx: {
                    color: calculateDue() > 0 ? 'error.main' : 'success.main'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Customer:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {formik.values.customerName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Item:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {formik.values.itemName} (x{formik.values.quantity})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        ৳ {formik.values.totalAmount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Due Amount:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium" color="error.main">
                        ৳ {calculateDue()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderForm;
