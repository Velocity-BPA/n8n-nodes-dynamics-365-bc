/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Dynamics365BC } from '../nodes/Dynamics 365 BC/Dynamics 365 BC.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Dynamics365BC Node', () => {
  let node: Dynamics365BC;

  beforeAll(() => {
    node = new Dynamics365BC();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Dynamics 365 BC');
      expect(node.description.name).toBe('dynamics365bc');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  test('should get all customers successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomers')
      .mockReturnValueOnce('company-123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      value: [{ id: '1', name: 'Customer 1' }]
    });

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.value).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0/companies(company-123)/customers',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
  });

  test('should get specific customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('company-123')
      .mockReturnValueOnce('customer-456')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'customer-456',
      name: 'Test Customer'
    });

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('customer-456');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0/companies(company-123)/customers(customer-456)',
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json'
      },
      json: true
    });
  });

  test('should create customer successfully', async () => {
    const customerData = { name: 'New Customer', email: 'test@example.com' };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomer')
      .mockReturnValueOnce('company-123')
      .mockReturnValueOnce(customerData);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'new-customer-id',
      ...customerData
    });

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.name).toBe('New Customer');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0/companies(company-123)/customers',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(customerData),
      json: true
    });
  });

  test('should handle error and continue on fail', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('company-123')
      .mockReturnValueOnce('invalid-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Customer not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Customer not found');
  });
});

describe('Vendor Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/environment/api/v2.0',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getVendors operation', () => {
		it('should retrieve all vendors successfully', async () => {
			const mockResponse = { value: [{ id: '1', displayName: 'Test Vendor' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getVendors';
					case 'companyId': return 'company-123';
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: expect.stringContaining('/companies(company-123)/vendors'),
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
				}),
				json: true,
			});
		});

		it('should handle errors when retrieving vendors', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getVendors';
					case 'companyId': return 'company-123';
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createVendor operation', () => {
		it('should create a vendor successfully', async () => {
			const vendorData = { displayName: 'New Vendor', number: 'V001' };
			const mockResponse = { id: '123', ...vendorData };
			
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'createVendor';
					case 'companyId': return 'company-123';
					case 'vendorData': return vendorData;
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: expect.stringContaining('/companies(company-123)/vendors'),
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				}),
				body: vendorData,
				json: true,
			});
		});
	});

	describe('updateVendor operation', () => {
		it('should update a vendor successfully', async () => {
			const vendorData = { displayName: 'Updated Vendor' };
			const mockResponse = { id: '123', ...vendorData };
			
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'updateVendor';
					case 'companyId': return 'company-123';
					case 'vendorId': return 'vendor-456';
					case 'vendorData': return vendorData;
					case 'ifMatch': return '"etag-value"';
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: expect.stringContaining('/companies(company-123)/vendors(vendor-456)'),
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
					'If-Match': '"etag-value"',
				}),
				body: vendorData,
				json: true,
			});
		});
	});

	describe('deleteVendor operation', () => {
		it('should delete a vendor successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'deleteVendor';
					case 'companyId': return 'company-123';
					case 'vendorId': return 'vendor-456';
					case 'ifMatch': return '"etag-value"';
					default: return '';
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeVendorOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: expect.stringContaining('/companies(company-123)/vendors(vendor-456)'),
				headers: expect.objectContaining({
					Authorization: 'Bearer test-token',
					'If-Match': '"etag-value"',
				}),
				json: true,
			});
		});
	});
});

describe('Item Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get items successfully', async () => {
    const mockResponse = { value: [{ id: '1', displayName: 'Test Item' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getItems';
        case 'companyId': return 'company-123';
        case 'filter': return '';
        case 'select': return '';
        case 'expand': return '';
        case 'top': return 50;
        case 'skip': return 0;
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: expect.stringContaining('/companies(company-123)/items'),
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
      },
      json: true,
    });
  });

  it('should get a specific item successfully', async () => {
    const mockResponse = { id: '1', displayName: 'Test Item' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getItem';
        case 'companyId': return 'company-123';
        case 'itemId': return 'item-456';
        case 'select': return '';
        case 'expand': return '';
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: expect.stringContaining('/companies(company-123)/items(item-456)'),
      headers: {
        'Authorization': 'Bearer test-token',
        'Accept': 'application/json',
      },
      json: true,
    });
  });

  it('should create an item successfully', async () => {
    const itemData = { displayName: 'New Item', type: 'Inventory' };
    const mockResponse = { id: '1', ...itemData };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createItem';
        case 'companyId': return 'company-123';
        case 'itemData': return itemData;
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: expect.stringContaining('/companies(company-123)/items'),
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: itemData,
      json: true,
    });
  });

  it('should update an item successfully', async () => {
    const itemData = { displayName: 'Updated Item' };
    const mockResponse = { id: '1', ...itemData };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateItem';
        case 'companyId': return 'company-123';
        case 'itemId': return 'item-456';
        case 'itemData': return itemData;
        case 'ifMatch': return 'etag-123';
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: expect.stringContaining('/companies(company-123)/items(item-456)'),
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'If-Match': 'etag-123',
      },
      body: itemData,
      json: true,
    });
  });

  it('should delete an item successfully', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(undefined);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteItem';
        case 'companyId': return 'company-123';
        case 'itemId': return 'item-456';
        case 'ifMatch': return 'etag-123';
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ success: true, itemId: 'item-456' });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: expect.stringContaining('/companies(company-123)/items(item-456)'),
      headers: {
        'Authorization': 'Bearer test-token',
        'If-Match': 'etag-123',
      },
      json: true,
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    const errorMessage = 'API Error';
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getItems';
        case 'companyId': return 'company-123';
        default: return '';
      }
    });

    const result = await executeItemOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: errorMessage });
  });

  it('should throw error when continueOnFail is false', async () => {
    const errorMessage = 'API Error';
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getItems';
        case 'companyId': return 'company-123';
        default: return '';
      }
    });

    await expect(executeItemOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow(errorMessage);
  });
});

describe('Sales Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/env/api/v2.0'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getSalesOrders operation', () => {
    it('should retrieve all sales orders successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSalesOrders')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce({});

      const mockResponse = { value: [{ id: '1', number: 'SO001' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSalesOrderOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle errors when retrieving sales orders', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSalesOrders')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeSalesOrderOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getSalesOrder operation', () => {
    it('should retrieve a specific sales order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSalesOrder')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce('test-order-id')
        .mockReturnValueOnce({});

      const mockResponse = { id: 'test-order-id', number: 'SO001' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSalesOrderOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('createSalesOrder operation', () => {
    it('should create a sales order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createSalesOrder')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce({ customerNumber: 'C001' });

      const mockResponse = { id: 'new-order-id', number: 'SO002' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSalesOrderOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('updateSalesOrder operation', () => {
    it('should update a sales order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateSalesOrder')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce('test-order-id')
        .mockReturnValueOnce({ customerNumber: 'C002' })
        .mockReturnValueOnce('W/"etag-value"');

      const mockResponse = { id: 'test-order-id', customerNumber: 'C002' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSalesOrderOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('deleteSalesOrder operation', () => {
    it('should delete a sales order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteSalesOrder')
        .mockReturnValueOnce('test-company-id')
        .mockReturnValueOnce('test-order-id')
        .mockReturnValueOnce('W/"etag-value"');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

      const result = await executeSalesOrderOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: {},
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('Sales Invoice Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/environments/environment/api/v2.0' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });

  it('should get all sales invoices successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSalesInvoices')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce({});
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ value: [{ id: 'invoice1' }] });

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ value: [{ id: 'invoice1' }] });
  });

  it('should get specific sales invoice successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSalesInvoice')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce('invoice-123')
      .mockReturnValueOnce({});
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'invoice-123' });

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'invoice-123' });
  });

  it('should create sales invoice successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createSalesInvoice')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce({ number: 'INV-001' });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'new-invoice', number: 'INV-001' });

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'new-invoice', number: 'INV-001' });
  });

  it('should update sales invoice successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateSalesInvoice')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce('invoice-123')
      .mockReturnValueOnce({ number: 'INV-001-UPDATED' })
      .mockReturnValueOnce('W/"etag-value"');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'invoice-123', number: 'INV-001-UPDATED' });

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ id: 'invoice-123', number: 'INV-001-UPDATED' });
  });

  it('should delete sales invoice successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteSalesInvoice')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce('invoice-123')
      .mockReturnValueOnce('W/"etag-value"');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({});
  });

  it('should post sales invoice successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('postSalesInvoice')
      .mockReturnValueOnce('test-company-id')
      .mockReturnValueOnce('invoice-123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ success: true });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSalesInvoices');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSalesInvoices');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeSalesInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Purchase Invoice Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/tenant/env/api/v2.0'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get all purchase invoices successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPurchaseInvoices')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce({ filter: 'status eq \'Open\'', top: 10 });

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			value: [{ id: 'invoice1', number: 'PI001' }]
		});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.value).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: expect.stringContaining('/purchaseInvoices?$filter='),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
			}),
			json: true,
		});
	});

	it('should get specific purchase invoice successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPurchaseInvoice')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce('test-invoice-id')
			.mockReturnValueOnce({ expand: 'purchaseInvoiceLines' });

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'test-invoice-id',
			number: 'PI001'
		});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe('test-invoice-id');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: expect.stringContaining('/purchaseInvoices(test-invoice-id)?$expand='),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
			}),
			json: true,
		});
	});

	it('should create purchase invoice successfully', async () => {
		const invoiceData = { vendorNumber: 'V001', dueDate: '2024-01-01' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createPurchaseInvoice')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce(invoiceData);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'new-invoice-id',
			...invoiceData
		});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe('new-invoice-id');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: expect.stringContaining('/purchaseInvoices'),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			}),
			body: invoiceData,
			json: true,
		});
	});

	it('should update purchase invoice successfully', async () => {
		const updateData = { dueDate: '2024-02-01' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updatePurchaseInvoice')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce('test-invoice-id')
			.mockReturnValueOnce(updateData)
			.mockReturnValueOnce('W/"12345"');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'test-invoice-id',
			...updateData
		});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.id).toBe('test-invoice-id');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PATCH',
			url: expect.stringContaining('/purchaseInvoices(test-invoice-id)'),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
				'If-Match': 'W/"12345"',
			}),
			body: updateData,
			json: true,
		});
	});

	it('should delete purchase invoice successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deletePurchaseInvoice')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce('test-invoice-id')
			.mockReturnValueOnce('W/"12345"');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: expect.stringContaining('/purchaseInvoices(test-invoice-id)'),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
				'If-Match': 'W/"12345"',
			}),
			json: true,
		});
	});

	it('should post purchase invoice successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('postPurchaseInvoice')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce('test-invoice-id');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			postedInvoiceId: 'posted-invoice-id'
		});

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: expect.stringContaining('/purchaseInvoices(test-invoice-id)/Microsoft.NAV.post'),
			headers: expect.objectContaining({
				'Authorization': 'Bearer test-token',
			}),
			json: true,
		});
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPurchaseInvoices')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce({});

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPurchaseInvoices')
			.mockReturnValueOnce('test-company-id')
			.mockReturnValueOnce({});

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);

		await expect(executePurchaseInvoiceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		)).rejects.toThrow('API Error');
	});
});

describe('Company Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.businesscentral.dynamics.com/v2.0/test-tenant/environments/test-env/api/v2.0',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getCompanies operation', () => {
		it('should retrieve companies successfully', async () => {
			const mockResponse = { value: [{ id: 'company1', name: 'Test Company' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getCompanies';
				return '';
			});

			const result = await executeCompanyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.businesscentral.dynamics.com/v2.0/test-tenant/environments/test-env/api/v2.0/companies',
				headers: {
					'Authorization': 'Bearer test-token',
					'Accept': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors gracefully when continueOnFail is true', async () => {
			const error = new Error('API Error');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getCompanies';
				return '';
			});

			const result = await executeCompanyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ error: 'API Error' });
		});
	});

	describe('getCompany operation', () => {
		it('should retrieve a specific company successfully', async () => {
			const mockResponse = { id: 'company1', name: 'Test Company' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getCompany';
				if (param === 'companyId') return 'company1';
				return '';
			});

			const result = await executeCompanyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.businesscentral.dynamics.com/v2.0/test-tenant/environments/test-env/api/v2.0/companies(company1)',
				headers: {
					'Authorization': 'Bearer test-token',
					'Accept': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('updateCompany operation', () => {
		it('should update a company successfully', async () => {
			const mockResponse = { id: 'company1', name: 'Updated Company' };
			const updateData = { name: 'Updated Company' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'updateCompany';
				if (param === 'companyId') return 'company1';
				if (param === 'companyData') return updateData;
				if (param === 'ifMatch') return '"12345"';
				return '';
			});

			const result = await executeCompanyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.businesscentral.dynamics.com/v2.0/test-tenant/environments/test-env/api/v2.0/companies(company1)',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'If-Match': '"12345"',
				},
				body: updateData,
				json: true,
			});
		});

		it('should handle update errors', async () => {
			const error = new Error('Update failed');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'updateCompany';
				if (param === 'companyId') return 'company1';
				if (param === 'companyData') return { name: 'Updated Company' };
				if (param === 'ifMatch') return '"12345"';
				return '';
			});

			await expect(
				executeCompanyOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('Update failed');
		});
	});
});
});
