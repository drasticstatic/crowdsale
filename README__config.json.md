# `config.json` Documentation

## Overview
This file explains the `config.json` file used in our crowdsale project and how to add notes to JSON files
<br>
<br>

## *===* <u>Adding Notes</u> to JSON Files *===*
&nbsp;&nbsp;&nbsp;&nbsp;
<em>JSON (JavaScript Object Notation) doesn't officially support comments</em><br>
&nbsp;&nbsp;&nbsp;&nbsp;<strong>Here are the <u>recommended approaches for adding notes</u> to JSON files:</strong><br><br>

### 1. Use Documentation Fields
&nbsp;&nbsp;&nbsp;&nbsp;
Add special fields with underscore prefixes to hold documentation:

```json
{
  "_comment": "Configuration for the crowdsale application",
  "_version": "1.0",
  "tokenAddress": "0x...",
  "crowdsaleAddress": "0x..."
}
```

### 2. Create External Documentation (This File)
&nbsp;&nbsp;&nbsp;&nbsp;
Keep a separate markdown file (like this one) that documents your JSON structure

### 3. Use Description Fields
&nbsp;&nbsp;&nbsp;&nbsp;
Include description fields as part of your data structure:

```json
{
  "tokenAddress": {
    "value": "0x...",
    "description": "The deployed token contract address"
  },
  "crowdsaleAddress": {
    "value": "0x...",
    "description": "The deployed crowdsale contract address"
  }
}
```

### 4. JSON Schema
&nbsp;&nbsp;&nbsp;&nbsp;
Create a separate JSON Schema file that documents and validates your configuration:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Crowdsale Configuration",
  "description": "Configuration settings for the crowdsale application",
  "type": "object",
  "properties": {
    "tokenAddress": {
      "type": "string",
      "description": "The deployed token contract address",
      "pattern": "^0x[a-fA-F0-9]{40}$"
    },
    "crowdsaleAddress": {
      "type": "string",
      "description": "The deployed crowdsale contract address",
      "pattern": "^0x[a-fA-F0-9]{40}$"
    }
  },
  "required": ["tokenAddress", "crowdsaleAddress"]
}
```
&nbsp;&nbsp;&nbsp;&nbsp;
Benefits of JSON Schema:
- Provides documentation for each field
- Validates that your config file is correctly formatted
- Many IDEs support JSON Schema for autocompletion and validation
- Can be used to generate documentation automatically

### 5. For Development Only: JSON5
&nbsp;&nbsp;&nbsp;&nbsp;
During development, you can use JSON5 format which supports comments:

```json5
{
  // This is the token contract address
  "tokenAddress": "0x...",
  
  // This is the crowdsale contract address
  "crowdsaleAddress": "0x..."
}
```
&nbsp;&nbsp;&nbsp;&nbsp;
Note: JSON5 requires a special parser and isn't standard JSON

## Best Practices

1. Keep comments concise and relevant
2. Update documentation when changing the JSON file
3. For configuration files used by applications, prefer the "_comment" approach
4. For API responses or data exchange, keep the JSON clean without comment fields
5. Consider using JSON Schema for complex configuration files that need validation