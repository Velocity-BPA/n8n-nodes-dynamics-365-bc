# n8n-nodes-dynamics-365-bc

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Microsoft Dynamics 365 Business Central, supporting 7 core business resources. Access customer data, manage vendors, track inventory items, process sales orders and invoices, handle purchase invoices, and retrieve company information through a unified interface.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Microsoft Dynamics 365](https://img.shields.io/badge/Microsoft-Dynamics%20365%20BC-0078d4)
![ERP](https://img.shields.io/badge/ERP-Integration-green)
![Business Central](https://img.shields.io/badge/Business%20Central-API-orange)

## Features

- **Customer Management** - Create, read, update, and delete customer records with full contact and billing information
- **Vendor Operations** - Comprehensive vendor management including supplier details and payment terms
- **Inventory Control** - Track items with pricing, stock levels, and product specifications
- **Sales Processing** - Handle sales orders from creation to completion with line item management
- **Invoice Management** - Process both sales and purchase invoices with automated calculations
- **Company Data Access** - Retrieve company information and organizational details
- **Real-time Synchronization** - Immediate data updates between n8n workflows and Business Central
- **Error Handling** - Robust error detection with detailed feedback for troubleshooting

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-dynamics-365-bc`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-dynamics-365-bc
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-dynamics-365-bc.git
cd n8n-nodes-dynamics-365-bc
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-dynamics-365-bc
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Dynamics 365 Business Central API key | Yes |
| Server URL | Base URL of your Business Central instance (e.g., https://api.businesscentral.dynamics.com/v2.0/tenant-id/environment-name) | Yes |
| Company ID | The unique identifier for your company in Business Central | Yes |

## Resources & Operations

### 1. Customer

| Operation | Description |
|-----------|-------------|
| Create | Add a new customer record with contact details |
| Get | Retrieve a specific customer by ID |
| Get All | List all customers with optional filtering |
| Update | Modify existing customer information |
| Delete | Remove a customer record |

### 2. Vendor

| Operation | Description |
|-----------|-------------|
| Create | Create a new vendor record |
| Get | Fetch vendor details by ID |
| Get All | Retrieve all vendors with search capabilities |
| Update | Edit vendor information and payment terms |
| Delete | Remove vendor from system |

### 3. Item

| Operation | Description |
|-----------|-------------|
| Create | Add new inventory items with pricing |
| Get | Get specific item details and stock levels |
| Get All | List all items with filtering options |
| Update | Modify item information and pricing |
| Delete | Remove item from inventory |

### 4. Sales Order

| Operation | Description |
|-----------|-------------|
| Create | Generate new sales orders with line items |
| Get | Retrieve sales order details and status |
| Get All | List sales orders with date range filtering |
| Update | Modify order details and quantities |
| Delete | Cancel or remove sales orders |

### 5. Sales Invoice

| Operation | Description |
|-----------|-------------|
| Create | Create sales invoices from orders or standalone |
| Get | Fetch invoice details and payment status |
| Get All | List all sales invoices with filters |
| Update | Modify invoice information |
| Delete | Void or remove sales invoices |

### 6. Purchase Invoice

| Operation | Description |
|-----------|-------------|
| Create | Create purchase invoices for vendor payments |
| Get | Retrieve purchase invoice details |
| Get All | List purchase invoices with vendor filtering |
| Update | Edit purchase invoice information |
| Delete | Remove purchase invoices |

### 7. Company

| Operation | Description |
|-----------|-------------|
| Get | Retrieve company information and settings |
| Get All | List all available companies |
| Update | Modify company details and preferences |

## Usage Examples

```javascript
// Create a new customer
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phoneNumber": "+1-555-0123",
  "addressLine1": "123 Business St",
  "city": "Seattle",
  "state": "WA",
  "postalCode": "98101",
  "countryRegionCode": "US"
}
```

```javascript
// Create a sales order
{
  "customerNumber": "CUST001",
  "orderDate": "2024-01-15",
  "salesOrderLines": [
    {
      "itemNumber": "ITEM001",
      "quantity": 5,
      "unitPrice": 29.99,
      "description": "Premium Widget"
    }
  ]
}
```

```javascript
// Get all items with filtering
{
  "filter": "unitPrice gt 100",
  "select": ["number", "displayName", "unitPrice", "inventory"],
  "top": 50
}
```

```javascript
// Update vendor payment terms
{
  "vendorId": "VEND001",
  "paymentTermsCode": "NET30",
  "paymentMethodCode": "CHECK",
  "currencyCode": "USD"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or expired token | Verify API key in credentials and check token expiration |
| 404 Not Found | Resource ID does not exist | Confirm the ID exists and is accessible in your company |
| 400 Bad Request | Invalid data format or missing required fields | Check required fields and data types in request body |
| 403 Forbidden | Insufficient permissions for operation | Ensure API key has proper permissions for the resource |
| 429 Too Many Requests | Rate limit exceeded | Implement delays between requests or reduce frequency |
| 500 Internal Server Error | Business Central service issue | Check service status and retry after a few minutes |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-dynamics-365-bc/issues)
- **API Documentation**: [Microsoft Dynamics 365 BC API Reference](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/api-reference/v2.0/)
- **Business Central Community**: [Microsoft Business Central Community](https://community.dynamics.com/business/)