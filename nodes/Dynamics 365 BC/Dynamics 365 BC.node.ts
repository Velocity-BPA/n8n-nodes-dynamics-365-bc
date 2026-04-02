/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-dynamics365bc/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Dynamics365BC implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Dynamics 365 BC',
    name: 'dynamics365bc',
    icon: 'file:dynamics365bc.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Dynamics 365 BC API',
    defaults: {
      name: 'Dynamics 365 BC',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'dynamics365bcApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Vendor',
            value: 'vendor',
          },
          {
            name: 'Item',
            value: 'item',
          },
          {
            name: 'Sales Order',
            value: 'salesOrder',
          },
          {
            name: 'Sales Invoice',
            value: 'salesInvoice',
          },
          {
            name: 'Purchase Invoice',
            value: 'purchaseInvoice',
          },
          {
            name: 'Company',
            value: 'company',
          }
        ],
        default: 'customer',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['customer'] } },
  options: [
    { name: 'Get All Customers', value: 'getCustomers', description: 'Retrieve all customers', action: 'Get all customers' },
    { name: 'Get Customer', value: 'getCustomer', description: 'Retrieve specific customer by ID', action: 'Get a customer' },
    { name: 'Create Customer', value: 'createCustomer', description: 'Create a new customer', action: 'Create a customer' },
    { name: 'Update Customer', value: 'updateCustomer', description: 'Update an existing customer', action: 'Update a customer' },
    { name: 'Delete Customer', value: 'deleteCustomer', description: 'Delete a customer', action: 'Delete a customer' }
  ],
  default: 'getCustomers',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
		},
	},
	options: [
		{
			name: 'Get All Vendors',
			value: 'getVendors',
			description: 'Retrieve all vendors',
			action: 'Get all vendors',
		},
		{
			name: 'Get Vendor',
			value: 'getVendor',
			description: 'Retrieve a specific vendor',
			action: 'Get a vendor',
		},
		{
			name: 'Create Vendor',
			value: 'createVendor',
			description: 'Create a new vendor',
			action: 'Create a vendor',
		},
		{
			name: 'Update Vendor',
			value: 'updateVendor',
			description: 'Update an existing vendor',
			action: 'Update a vendor',
		},
		{
			name: 'Delete Vendor',
			value: 'deleteVendor',
			description: 'Delete a vendor',
			action: 'Delete a vendor',
		},
	],
	default: 'getVendors',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['item'],
    },
  },
  options: [
    {
      name: 'Get Items',
      value: 'getItems',
      description: 'Retrieve all items',
      action: 'Get items',
    },
    {
      name: 'Get Item',
      value: 'getItem',
      description: 'Retrieve a specific item',
      action: 'Get item',
    },
    {
      name: 'Create Item',
      value: 'createItem',
      description: 'Create a new item',
      action: 'Create item',
    },
    {
      name: 'Update Item',
      value: 'updateItem',
      description: 'Update an existing item',
      action: 'Update item',
    },
    {
      name: 'Delete Item',
      value: 'deleteItem',
      description: 'Delete an item',
      action: 'Delete item',
    },
  ],
  default: 'getItems',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['salesOrder'] } },
  options: [
    { name: 'Get All Sales Orders', value: 'getSalesOrders', description: 'Retrieve all sales orders', action: 'Get all sales orders' },
    { name: 'Get Sales Order', value: 'getSalesOrder', description: 'Retrieve a specific sales order', action: 'Get a sales order' },
    { name: 'Create Sales Order', value: 'createSalesOrder', description: 'Create a new sales order', action: 'Create a sales order' },
    { name: 'Update Sales Order', value: 'updateSalesOrder', description: 'Update an existing sales order', action: 'Update a sales order' },
    { name: 'Delete Sales Order', value: 'deleteSalesOrder', description: 'Delete a sales order', action: 'Delete a sales order' },
  ],
  default: 'getSalesOrders',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['salesInvoice'] } },
  options: [
    { name: 'Get Sales Invoices', value: 'getSalesInvoices', description: 'Retrieve all sales invoices', action: 'Get all sales invoices' },
    { name: 'Get Sales Invoice', value: 'getSalesInvoice', description: 'Retrieve specific sales invoice', action: 'Get a sales invoice' },
    { name: 'Create Sales Invoice', value: 'createSalesInvoice', description: 'Create new sales invoice', action: 'Create a sales invoice' },
    { name: 'Update Sales Invoice', value: 'updateSalesInvoice', description: 'Update existing sales invoice', action: 'Update a sales invoice' },
    { name: 'Delete Sales Invoice', value: 'deleteSalesInvoice', description: 'Delete sales invoice', action: 'Delete a sales invoice' },
    { name: 'Post Sales Invoice', value: 'postSalesInvoice', description: 'Post sales invoice', action: 'Post a sales invoice' },
  ],
  default: 'getSalesInvoices',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['purchaseInvoice'] } },
	options: [
		{
			name: 'Get All Purchase Invoices',
			value: 'getPurchaseInvoices',
			description: 'Retrieve all purchase invoices',
			action: 'Get all purchase invoices',
		},
		{
			name: 'Get Purchase Invoice',
			value: 'getPurchaseInvoice',
			description: 'Retrieve specific purchase invoice',
			action: 'Get a purchase invoice',
		},
		{
			name: 'Create Purchase Invoice',
			value: 'createPurchaseInvoice',
			description: 'Create new purchase invoice',
			action: 'Create a purchase invoice',
		},
		{
			name: 'Update Purchase Invoice',
			value: 'updatePurchaseInvoice',
			description: 'Update existing purchase invoice',
			action: 'Update a purchase invoice',
		},
		{
			name: 'Delete Purchase Invoice',
			value: 'deletePurchaseInvoice',
			description: 'Delete purchase invoice',
			action: 'Delete a purchase invoice',
		},
		{
			name: 'Post Purchase Invoice',
			value: 'postPurchaseInvoice',
			description: 'Post purchase invoice',
			action: 'Post a purchase invoice',
		},
	],
	default: 'getPurchaseInvoices',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['company'],
		},
	},
	options: [
		{
			name: 'Get Many',
			value: 'getCompanies',
			description: 'Retrieve all companies',
			action: 'Get many companies',
		},
		{
			name: 'Get',
			value: 'getCompany',
			description: 'Retrieve a specific company',
			action: 'Get a company',
		},
		{
			name: 'Update',
			value: 'updateCompany',
			description: 'Update company information',
			action: 'Update a company',
		},
	],
	default: 'getCompanies',
},
{
  displayName: 'Company ID',
  name: 'companyId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'] } },
  default: '',
  description: 'The company identifier',
},
{
  displayName: 'Customer ID',
  name: 'customerId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomer', 'updateCustomer', 'deleteCustomer'] } },
  default: '',
  description: 'The customer identifier',
},
{
  displayName: 'Filter',
  name: 'filter',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: '',
  description: 'OData $filter query parameter to filter results',
},
{
  displayName: 'Select',
  name: 'select',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers', 'getCustomer'] } },
  default: '',
  description: 'OData $select query parameter to specify fields to return',
},
{
  displayName: 'Expand',
  name: 'expand',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers', 'getCustomer'] } },
  default: '',
  description: 'OData $expand query parameter to include related data',
},
{
  displayName: 'Top',
  name: 'top',
  type: 'number',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: 100,
  description: 'OData $top query parameter to limit number of results',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  displayOptions: { show: { resource: ['customer'], operation: ['getCustomers'] } },
  default: 0,
  description: 'OData $skip query parameter to skip number of results',
},
{
  displayName: 'Customer Data',
  name: 'customerData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['customer'], operation: ['createCustomer', 'updateCustomer'] } },
  default: '{}',
  description: 'Customer data as JSON object',
},
{
  displayName: 'If-Match Header',
  name: 'ifMatch',
  type: 'string',
  displayOptions: { show: { resource: ['customer'], operation: ['updateCustomer', 'deleteCustomer'] } },
  default: '',
  description: 'ETag value for optimistic concurrency control',
},
{
	displayName: 'Company ID',
	name: 'companyId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors', 'getVendor', 'createVendor', 'updateVendor', 'deleteVendor'],
		},
	},
	default: '',
	description: 'The ID of the company',
},
{
	displayName: 'Vendor ID',
	name: 'vendorId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendor', 'updateVendor', 'deleteVendor'],
		},
	},
	default: '',
	description: 'The ID of the vendor',
},
{
	displayName: 'Filter',
	name: 'filter',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors'],
		},
	},
	default: '',
	description: 'OData $filter parameter to filter results',
},
{
	displayName: 'Select',
	name: 'select',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors', 'getVendor'],
		},
	},
	default: '',
	description: 'OData $select parameter to select specific fields',
},
{
	displayName: 'Expand',
	name: 'expand',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors', 'getVendor'],
		},
	},
	default: '',
	description: 'OData $expand parameter to expand related entities',
},
{
	displayName: 'Top',
	name: 'top',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors'],
		},
	},
	default: '',
	description: 'OData $top parameter to limit the number of results',
},
{
	displayName: 'Skip',
	name: 'skip',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['getVendors'],
		},
	},
	default: '',
	description: 'OData $skip parameter to skip results',
},
{
	displayName: 'Vendor Data',
	name: 'vendorData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['createVendor', 'updateVendor'],
		},
	},
	default: '{}',
	description: 'The vendor data as JSON object',
},
{
	displayName: 'If-Match',
	name: 'ifMatch',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['vendor'],
			operation: ['updateVendor', 'deleteVendor'],
		},
	},
	default: '',
	description: 'ETag value for concurrency control (required for updates and deletes)',
},
{
  displayName: 'Company ID',
  name: 'companyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems', 'getItem', 'createItem', 'updateItem', 'deleteItem'],
    },
  },
  default: '',
  description: 'The ID of the company',
},
{
  displayName: 'Item ID',
  name: 'itemId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItem', 'updateItem', 'deleteItem'],
    },
  },
  default: '',
  description: 'The ID of the item',
},
{
  displayName: 'Filter',
  name: 'filter',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems'],
    },
  },
  default: '',
  description: 'OData $filter parameter to filter items',
},
{
  displayName: 'Select',
  name: 'select',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems', 'getItem'],
    },
  },
  default: '',
  description: 'OData $select parameter to specify which fields to return',
},
{
  displayName: 'Expand',
  name: 'expand',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems', 'getItem'],
    },
  },
  default: '',
  description: 'OData $expand parameter to include related data',
},
{
  displayName: 'Top',
  name: 'top',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems'],
    },
  },
  default: 50,
  description: 'OData $top parameter to limit the number of items returned',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['getItems'],
    },
  },
  default: 0,
  description: 'OData $skip parameter to skip a number of items',
},
{
  displayName: 'Item Data',
  name: 'itemData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['createItem', 'updateItem'],
    },
  },
  default: '{}',
  description: 'The item data as a JSON object',
},
{
  displayName: 'If-Match Header',
  name: 'ifMatch',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['item'],
      operation: ['updateItem', 'deleteItem'],
    },
  },
  default: '',
  description: 'The ETag value for optimistic concurrency control',
},
{
  displayName: 'Company ID',
  name: 'companyId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['salesOrder'],
      operation: ['getSalesOrders', 'getSalesOrder', 'createSalesOrder', 'updateSalesOrder', 'deleteSalesOrder'],
    },
  },
  default: '',
  description: 'The ID of the company',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['salesOrder'],
      operation: ['getSalesOrder', 'updateSalesOrder', 'deleteSalesOrder'],
    },
  },
  default: '',
  description: 'The ID of the sales order',
},
{
  displayName: 'Sales Order Data',
  name: 'salesOrderData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['salesOrder'],
      operation: ['createSalesOrder', 'updateSalesOrder'],
    },
  },
  default: '{}',
  description: 'The sales order data as JSON object',
},
{
  displayName: 'If-Match Header',
  name: 'ifMatch',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['salesOrder'],
      operation: ['updateSalesOrder', 'deleteSalesOrder'],
    },
  },
  default: '',
  description: 'ETag value for optimistic concurrency control',
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['salesOrder'],
      operation: ['getSalesOrders', 'getSalesOrder'],
    },
  },
  options: [
    {
      displayName: 'Filter',
      name: 'filter',
      type: 'string',
      default: '',
      description: 'OData $filter query parameter',
    },
    {
      displayName: 'Select',
      name: 'select',
      type: 'string',
      default: '',
      description: 'OData $select query parameter',
    },
    {
      displayName: 'Expand',
      name: 'expand',
      type: 'string',
      default: '',
      description: 'OData $expand query parameter',
    },
    {
      displayName: 'Top',
      name: 'top',
      type: 'number',
      default: '',
      description: 'OData $top query parameter',
    },
    {
      displayName: 'Skip',
      name: 'skip',
      type: 'number',
      default: '',
      description: 'OData $skip query parameter',
    },
  ],
},
{
  displayName: 'Company ID',
  name: 'companyId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['salesInvoice'],
      operation: ['getSalesInvoices', 'getSalesInvoice', 'createSalesInvoice', 'updateSalesInvoice', 'deleteSalesInvoice', 'postSalesInvoice'],
    },
  },
  description: 'The ID of the company',
},
{
  displayName: 'Invoice ID',
  name: 'invoiceId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['salesInvoice'],
      operation: ['getSalesInvoice', 'updateSalesInvoice', 'deleteSalesInvoice', 'postSalesInvoice'],
    },
  },
  description: 'The ID of the sales invoice',
},
{
  displayName: 'Sales Invoice Data',
  name: 'salesInvoiceData',
  type: 'json',
  required: true,
  default: '{}',
  displayOptions: {
    show: {
      resource: ['salesInvoice'],
      operation: ['createSalesInvoice', 'updateSalesInvoice'],
    },
  },
  description: 'The sales invoice data to create or update',
},
{
  displayName: 'If-Match',
  name: 'ifMatch',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['salesInvoice'],
      operation: ['updateSalesInvoice', 'deleteSalesInvoice'],
    },
  },
  description: 'The ETag value for optimistic concurrency',
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['salesInvoice'],
      operation: ['getSalesInvoices', 'getSalesInvoice'],
    },
  },
  options: [
    {
      displayName: 'Filter',
      name: 'filter',
      type: 'string',
      default: '',
      description: 'OData $filter parameter',
    },
    {
      displayName: 'Select',
      name: 'select',
      type: 'string',
      default: '',
      description: 'OData $select parameter',
    },
    {
      displayName: 'Expand',
      name: 'expand',
      type: 'string',
      default: '',
      description: 'OData $expand parameter',
    },
    {
      displayName: 'Top',
      name: 'top',
      type: 'number',
      default: '',
      description: 'OData $top parameter',
    },
    {
      displayName: 'Skip',
      name: 'skip',
      type: 'number',
      default: '',
      description: 'OData $skip parameter',
    },
  ],
},
{
	displayName: 'Company ID',
	name: 'companyId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['purchaseInvoice'],
			operation: ['getPurchaseInvoices', 'getPurchaseInvoice', 'createPurchaseInvoice', 'updatePurchaseInvoice', 'deletePurchaseInvoice', 'postPurchaseInvoice'],
		},
	},
	default: '',
	description: 'The ID of the company',
},
{
	displayName: 'Invoice ID',
	name: 'invoiceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['purchaseInvoice'],
			operation: ['getPurchaseInvoice', 'updatePurchaseInvoice', 'deletePurchaseInvoice', 'postPurchaseInvoice'],
		},
	},
	default: '',
	description: 'The ID of the purchase invoice',
},
{
	displayName: 'Invoice Data',
	name: 'invoiceData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['purchaseInvoice'],
			operation: ['createPurchaseInvoice', 'updatePurchaseInvoice'],
		},
	},
	default: '{}',
	description: 'The purchase invoice data as JSON object',
},
{
	displayName: 'If-Match Header',
	name: 'ifMatch',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['purchaseInvoice'],
			operation: ['updatePurchaseInvoice', 'deletePurchaseInvoice'],
		},
	},
	default: '',
	description: 'ETag value for concurrency control',
},
{
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			resource: ['purchaseInvoice'],
			operation: ['getPurchaseInvoices', 'getPurchaseInvoice'],
		},
	},
	options: [
		{
			displayName: 'Filter',
			name: 'filter',
			type: 'string',
			default: '',
			description: 'OData $filter parameter to filter results',
		},
		{
			displayName: 'Select',
			name: 'select',
			type: 'string',
			default: '',
			description: 'OData $select parameter to choose specific fields',
		},
		{
			displayName: 'Expand',
			name: 'expand',
			type: 'string',
			default: '',
			description: 'OData $expand parameter to include related data',
		},
		{
			displayName: 'Top',
			name: 'top',
			type: 'number',
			default: 20,
			description: 'Number of records to return',
		},
		{
			displayName: 'Skip',
			name: 'skip',
			type: 'number',
			default: 0,
			description: 'Number of records to skip',
		},
	],
},
{
	displayName: 'Company ID',
	name: 'companyId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['getCompany', 'updateCompany'],
		},
	},
	default: '',
	description: 'The ID of the company',
},
{
	displayName: 'Select Fields',
	name: 'select',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['getCompanies', 'getCompany'],
		},
	},
	default: '',
	description: 'Comma-separated list of fields to select',
},
{
	displayName: 'Filter',
	name: 'filter',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['getCompanies'],
		},
	},
	default: '',
	description: 'OData filter expression',
},
{
	displayName: 'Top',
	name: 'top',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['getCompanies'],
		},
	},
	default: '',
	description: 'Number of records to return',
},
{
	displayName: 'Skip',
	name: 'skip',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['getCompanies'],
		},
	},
	default: '',
	description: 'Number of records to skip',
},
{
	displayName: 'Company Data',
	name: 'companyData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['updateCompany'],
		},
	},
	default: '{}',
	description: 'The company data to update',
},
{
	displayName: 'If-Match',
	name: 'ifMatch',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['company'],
			operation: ['updateCompany'],
		},
	},
	default: '',
	description: 'ETag value for optimistic concurrency control',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'customer':
        return [await executeCustomerOperations.call(this, items)];
      case 'vendor':
        return [await executeVendorOperations.call(this, items)];
      case 'item':
        return [await executeItemOperations.call(this, items)];
      case 'salesOrder':
        return [await executeSalesOrderOperations.call(this, items)];
      case 'salesInvoice':
        return [await executeSalesInvoiceOperations.call(this, items)];
      case 'purchaseInvoice':
        return [await executePurchaseInvoiceOperations.call(this, items)];
      case 'company':
        return [await executeCompanyOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCustomerOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dynamics365bcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const companyId = this.getNodeParameter('companyId', i) as string;
      
      switch (operation) {
        case 'getCustomers': {
          const queryParams: any = {};
          const filter = this.getNodeParameter('filter', i) as string;
          const select = this.getNodeParameter('select', i) as string;
          const expand = this.getNodeParameter('expand', i) as string;
          const top = this.getNodeParameter('top', i) as number;
          const skip = this.getNodeParameter('skip', i) as number;

          if (filter) queryParams['$filter'] = filter;
          if (select) queryParams['$select'] = select;
          if (expand) queryParams['$expand'] = expand;
          if (top) queryParams['$top'] = top;
          if (skip) queryParams['$skip'] = skip;

          const queryString = Object.keys(queryParams).length > 0 ? 
            '?' + new URLSearchParams(queryParams).toString() : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/companies(${companyId})/customers${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const queryParams: any = {};
          const select = this.getNodeParameter('select', i) as string;
          const expand = this.getNodeParameter('expand', i) as string;

          if (select) queryParams['$select'] = select;
          if (expand) queryParams['$expand'] = expand;

          const queryString = Object.keys(queryParams).length > 0 ? 
            '?' + new URLSearchParams(queryParams).toString() : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/companies(${companyId})/customers(${customerId})${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createCustomer': {
          const customerData = this.getNodeParameter('customerData', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/companies(${companyId})/customers`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(customerData),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const customerData = this.getNodeParameter('customerData', i) as any;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          
          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };

          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/companies(${companyId})/customers(${customerId})`,
            headers,
            body: JSON.stringify(customerData),
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'deleteCustomer': {
          const customerId = this.getNodeParameter('customerId', i) as string;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          
          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
          };

          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/companies(${companyId})/customers(${customerId})`,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeVendorOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dynamics365bcApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const companyId = this.getNodeParameter('companyId', i) as string;
			const baseUrl = `${credentials.baseUrl}/companies(${companyId})/vendors`;

			switch (operation) {
				case 'getVendors': {
					const queryParams: string[] = [];
					const filter = this.getNodeParameter('filter', i, '') as string;
					const select = this.getNodeParameter('select', i, '') as string;
					const expand = this.getNodeParameter('expand', i, '') as string;
					const top = this.getNodeParameter('top', i, '') as number;
					const skip = this.getNodeParameter('skip', i, '') as number;

					if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
					if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
					if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);
					if (top) queryParams.push(`$top=${top}`);
					if (skip) queryParams.push(`$skip=${skip}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${baseUrl}${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getVendor': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const queryParams: string[] = [];
					const select = this.getNodeParameter('select', i, '') as string;
					const expand = this.getNodeParameter('expand', i, '') as string;

					if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
					if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${baseUrl}(${vendorId})${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createVendor': {
					const vendorData = this.getNodeParameter('vendorData', i) as object;

					const options: any = {
						method: 'POST',
						url: baseUrl,
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: vendorData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateVendor': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const vendorData = this.getNodeParameter('vendorData', i) as object;
					const ifMatch = this.getNodeParameter('ifMatch', i) as string;

					const options: any = {
						method: 'PATCH',
						url: `${baseUrl}(${vendorId})`,
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
							'If-Match': ifMatch,
						},
						body: vendorData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteVendor': {
					const vendorId = this.getNodeParameter('vendorId', i) as string;
					const ifMatch = this.getNodeParameter('ifMatch', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${baseUrl}(${vendorId})`,
						headers: {
							Authorization: `Bearer ${credentials.accessToken}`,
							'If-Match': ifMatch,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeItemOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dynamics365bcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const companyId = this.getNodeParameter('companyId', i) as string;
      const baseUrl = `${credentials.baseUrl}/companies(${companyId})/items`;

      switch (operation) {
        case 'getItems': {
          const filter = this.getNodeParameter('filter', i) as string;
          const select = this.getNodeParameter('select', i) as string;
          const expand = this.getNodeParameter('expand', i) as string;
          const top = this.getNodeParameter('top', i) as number;
          const skip = this.getNodeParameter('skip', i) as number;

          const queryParams: string[] = [];
          if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
          if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
          if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);
          if (top) queryParams.push(`$top=${top}`);
          if (skip) queryParams.push(`$skip=${skip}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getItem': {
          const itemId = this.getNodeParameter('itemId', i) as string;
          const select = this.getNodeParameter('select', i) as string;
          const expand = this.getNodeParameter('expand', i) as string;

          const queryParams: string[] = [];
          if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
          if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${baseUrl}(${itemId})${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createItem': {
          const itemData = this.getNodeParameter('itemData', i) as any;

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: itemData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateItem': {
          const itemId = this.getNodeParameter('itemId', i) as string;
          const itemData = this.getNodeParameter('itemData', i) as any;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;

          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };

          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'PATCH',
            url: `${baseUrl}(${itemId})`,
            headers,
            body: itemData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteItem': {
          const itemId = this.getNodeParameter('itemId', i) as string;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;

          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
          };

          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}(${itemId})`,
            headers,
            json: true,
          };

          await this.helpers.httpRequest(options) as any;
          result = { success: true, itemId };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: {
          item: i,
        },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error.message,
          },
          pairedItem: {
            item: i,
          },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSalesOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dynamics365bcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const companyId = this.getNodeParameter('companyId', i) as string;
      const baseUrl = `${credentials.baseUrl}/companies(${companyId})/salesOrders`;

      switch (operation) {
        case 'getSalesOrders': {
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;
          const qs: any = {};
          
          if (additionalFields.filter) qs['$filter'] = additionalFields.filter;
          if (additionalFields.select) qs['$select'] = additionalFields.select;
          if (additionalFields.expand) qs['$expand'] = additionalFields.expand;
          if (additionalFields.top) qs['$top'] = additionalFields.top;
          if (additionalFields.skip) qs['$skip'] = additionalFields.skip;

          const options: any = {
            method: 'GET',
            url: baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            qs,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSalesOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;
          const qs: any = {};
          
          if (additionalFields.select) qs['$select'] = additionalFields.select;
          if (additionalFields.expand) qs['$expand'] = additionalFields.expand;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}(${orderId})`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            qs,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSalesOrder': {
          const salesOrderData = this.getNodeParameter('salesOrderData', i) as any;
          
          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: typeof salesOrderData === 'string' ? JSON.parse(salesOrderData) : salesOrderData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSalesOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const salesOrderData = this.getNodeParameter('salesOrderData', i) as any;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          
          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };
          
          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'PATCH',
            url: `${baseUrl}(${orderId})`,
            headers,
            body: typeof salesOrderData === 'string' ? JSON.parse(salesOrderData) : salesOrderData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteSalesOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          
          const headers: any = {
            'Authorization': `Bearer ${credentials.accessToken}`,
          };
          
          if (ifMatch) {
            headers['If-Match'] = ifMatch;
          }

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}(${orderId})`,
            headers,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSalesInvoiceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('dynamics365bcApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const companyId = this.getNodeParameter('companyId', i) as string;
      const baseUrl = `${credentials.baseUrl}/companies(${companyId})/salesInvoices`;

      switch (operation) {
        case 'getSalesInvoices': {
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;
          const queryParams: string[] = [];

          if (additionalFields.filter) {
            queryParams.push(`$filter=${encodeURIComponent(additionalFields.filter)}`);
          }
          if (additionalFields.select) {
            queryParams.push(`$select=${encodeURIComponent(additionalFields.select)}`);
          }
          if (additionalFields.expand) {
            queryParams.push(`$expand=${encodeURIComponent(additionalFields.expand)}`);
          }
          if (additionalFields.top) {
            queryParams.push(`$top=${additionalFields.top}`);
          }
          if (additionalFields.skip) {
            queryParams.push(`$skip=${additionalFields.skip}`);
          }

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const options: any = {
            method: 'GET',
            url: `${baseUrl}${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSalesInvoice': {
          const invoiceId = this.getNodeParameter('invoiceId', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as any;
          const queryParams: string[] = [];

          if (additionalFields.select) {
            queryParams.push(`$select=${encodeURIComponent(additionalFields.select)}`);
          }
          if (additionalFields.expand) {
            queryParams.push(`$expand=${encodeURIComponent(additionalFields.expand)}`);
          }

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const options: any = {
            method: 'GET',
            url: `${baseUrl}(${invoiceId})${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSalesInvoice': {
          const salesInvoiceData = this.getNodeParameter('salesInvoiceData', i) as any;
          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: salesInvoiceData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSalesInvoice': {
          const invoiceId = this.getNodeParameter('invoiceId', i) as string;
          const salesInvoiceData = this.getNodeParameter('salesInvoiceData', i) as any;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          const options: any = {
            method: 'PATCH',
            url: `${baseUrl}(${invoiceId})`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'If-Match': ifMatch,
            },
            body: salesInvoiceData,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteSalesInvoice': {
          const invoiceId = this.getNodeParameter('invoiceId', i) as string;
          const ifMatch = this.getNodeParameter('ifMatch', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}(${invoiceId})`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'If-Match': ifMatch,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'postSalesInvoice': {
          const invoiceId = this.getNodeParameter('invoiceId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}(${invoiceId})/Microsoft.NAV.post`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePurchaseInvoiceOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dynamics365bcApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getPurchaseInvoices': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as any;

					const queryParams: string[] = [];
					if (additionalFields.filter) queryParams.push(`$filter=${encodeURIComponent(additionalFields.filter)}`);
					if (additionalFields.select) queryParams.push(`$select=${encodeURIComponent(additionalFields.select)}`);
					if (additionalFields.expand) queryParams.push(`$expand=${encodeURIComponent(additionalFields.expand)}`);
					if (additionalFields.top) queryParams.push(`$top=${additionalFields.top}`);
					if (additionalFields.skip) queryParams.push(`$skip=${additionalFields.skip}`);

					const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPurchaseInvoice': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as any;

					const queryParams: string[] = [];
					if (additionalFields.select) queryParams.push(`$select=${encodeURIComponent(additionalFields.select)}`);
					if (additionalFields.expand) queryParams.push(`$expand=${encodeURIComponent(additionalFields.expand)}`);

					const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices(${invoiceId})${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createPurchaseInvoice': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const invoiceData = this.getNodeParameter('invoiceData', i) as any;

					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices`;

					const options: any = {
						method: 'POST',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: typeof invoiceData === 'string' ? JSON.parse(invoiceData) : invoiceData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updatePurchaseInvoice': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;
					const invoiceData = this.getNodeParameter('invoiceData', i) as any;
					const ifMatch = this.getNodeParameter('ifMatch', i) as string;

					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices(${invoiceId})`;

					const headers: any = {
						'Authorization': `Bearer ${credentials.accessToken}`,
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					};

					if (ifMatch) {
						headers['If-Match'] = ifMatch;
					}

					const options: any = {
						method: 'PATCH',
						url,
						headers,
						body: typeof invoiceData === 'string' ? JSON.parse(invoiceData) : invoiceData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deletePurchaseInvoice': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;
					const ifMatch = this.getNodeParameter('ifMatch', i) as string;

					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices(${invoiceId})`;

					const headers: any = {
						'Authorization': `Bearer ${credentials.accessToken}`,
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					};

					if (ifMatch) {
						headers['If-Match'] = ifMatch;
					}

					const options: any = {
						method: 'DELETE',
						url,
						headers,
						json: true,
					};

					await this.helpers.httpRequest(options) as any;
					result = { success: true, message: 'Purchase invoice deleted successfully' };
					break;
				}

				case 'postPurchaseInvoice': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;

					const url = `${credentials.baseUrl}/companies(${companyId})/purchaseInvoices(${invoiceId})/Microsoft.NAV.post`;

					const options: any = {
						method: 'POST',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeCompanyOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('dynamics365bcApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getCompanies': {
					const queryParams: string[] = [];
					
					const select = this.getNodeParameter('select', i) as string;
					if (select) {
						queryParams.push(`$select=${encodeURIComponent(select)}`);
					}

					const filter = this.getNodeParameter('filter', i) as string;
					if (filter) {
						queryParams.push(`$filter=${encodeURIComponent(filter)}`);
					}

					const top = this.getNodeParameter('top', i) as number;
					if (top) {
						queryParams.push(`$top=${top}`);
					}

					const skip = this.getNodeParameter('skip', i) as number;
					if (skip) {
						queryParams.push(`$skip=${skip}`);
					}

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/companies${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCompany': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const queryParams: string[] = [];
					
					const select = this.getNodeParameter('select', i) as string;
					if (select) {
						queryParams.push(`$select=${encodeURIComponent(select)}`);
					}

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/companies(${companyId})${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Accept': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateCompany': {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const companyData = this.getNodeParameter('companyData', i) as any;
					const ifMatch = this.getNodeParameter('ifMatch', i) as string;

					const url = `${credentials.baseUrl}/companies(${companyId})`;

					const options: any = {
						method: 'PATCH',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
							'Accept': 'application/json',
							'If-Match': ifMatch,
						},
						body: typeof companyData === 'string' ? JSON.parse(companyData) : companyData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
