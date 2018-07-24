---
title: API Authentication
category: API
date: 2018-03-06 00:00:00
readtime: 5
---

Authentication is the process of proving your identity to the system. Requests are allowed or denied in part based on the identity of the requester. As a developer, you'll be making requests that invoke certain privileges, so you'll need to prove your identity to the system by authenticating your requests.

The Site Stacker API uses a custom HTTP scheme based on a keyed-HMAC (Hash Message Authentication Code) for authentication. To authenticate a request, you first concatenate selected elements of the request to form a string. You then use your Site Stacker secret access key to calculate the HMAC of that string. Informally, we call this process "signing the request," and we call the output of the HMAC algorithm the signature, because it simulates the security properties of a real signature. Finally, you add this signature as a parameter of the request by using the syntax described in this guide.

When the system receives an authenticated request, it fetches the Site Stacker secret access key that you claim to have and uses it in the same way to compute a signature for the message it received. It then compares the signature it calculated against the signature presented by the requester. If the two signatures match, the system concludes that the requester must have access to the Site Stacker secret access key and therefore acts with the authority of the principal to whom the key was issued. If the two signatures do not match, the request is dropped and the system responds with an error message.

**Example Authenticated Site Stacker API Request**

```http
GET /api/endpoint HTTP/1.1
Host: sitestacker.com
Date: Mon, 26 Mar 2007 19:37:58 +0000
Authorization: HMAC 1qxji41u:730fe2eb31fa683fbbb2e0adf8ac15b414dd6c446e3c4f8c95a13c48896f94e0
```

## The Authentication Header

The Site Stacker API uses the standard HTTP `Authorization` header to pass authentication information. (The name of the standard header is unfortunate because it carries authentication information, not authorization). Under the Site Stacker authentication scheme, the Authorization header has the following form:

```
Authorization: HMAC AccessKeyId:Signature
```

Any Site Stacker user can have an access key ID and secret access key that are generated from the Users component in admin, by right clicking a user &gt; API Access and click on Generate API Keys, as shown below:

![API Access](https://git.sitestacker.com/sitestacker/docs/uploads/d4d3fc0304a9d6e26070885c633be29c/image.png)

![Generate API Keys](https://git.sitestacker.com/sitestacker/docs/uploads/3c7c6505db46114e92008af510faf1e5/image.png)

For request authentication, the `AccessKeyId` element identifies the access key ID that was used to compute the signature and, indirectly, the user making the request.

The `Signature` element is the RFC 4868 HMAC-SHA256 of selected elements from the request, and so the `Signature` part of the Authorization header will vary from request to request. If the request signature calculated by the system matches the `Signature` included with the request, the requester will have demonstrated possession of the Site Stacker secret access key. The request will then be processed under the identity, and with the authority, of the user to whom the key was issued.

Following is pseudogrammar that illustrates the construction of the `Authorization` request header. (In the example, `\n` means the Unicode code point `U+000A`, commonly called newline).

```bash
StringToSign = HTTP-Verb + "\n" +
	Content-Type + "\n" +
	Date;

Signature = HexEncode( HMAC-SHA256( SecretAccessKey, StringToSign ));

Authorization = "HMAC" + " " + AccessKeyId + ":" + Signature;
```

HMAC-SHA256 is an algorithm defined by [RFC 4868 - Using HMAC-SHA-256](https://tools.ietf.org/html/rfc4868). The algorithm takes as input two byte-strings, a key and a message. For Site Stacker request authentication, use your Site Stacker secret access key (`SecretAccessKey`) as the key, and the `StringToSign` as the message. The binary output of HMAC-SHA256 is then converted to a hexadecimal representation, called the hex digest, which is the `Signature`.

### Positional HTTP Header StringToSign Elements

All elements of `StringToSign` (Content-Type, Date) are positional in nature. `StringToSign` does not include the names of these headers, only their values from the request.

If a positional header called for in the definition of `StringToSign` is not present in your request (for example, `Content-Type` is optional for PUT requests and meaningless for GET requests), substitute the empty string ("") for that position.

## Time Stamp Requirement

A valid time stamp (using the HTTP `Date` header or an `ss-date` alternative) is mandatory for authenticated requests. Furthermore, the client timestamp included with an authenticated request must be within 5 minutes of the Site Stacker system time when the request is received. If not, the request will fail with the `RequestTimeTooSkewed` error code. The intention of these restrictions is to limit the possibility that intercepted requests could be replayed by an adversary. For stronger protection against eavesdropping, use the HTTPS transport for authenticated requests.

Some HTTP client libraries do not expose the ability to set the `Date` header for a request. If you have trouble including the value of the 'Date' header in the canonicalized headers, you can set the timestamp for the request by using an '`ss-date`' header instead. The value of the `ss-date` header must be in one of the RFC 2616 formats (http://www.ietf.org/rfc/rfc2616.txt). When an `ss-date` header is present in a request, the system will use this date when computing the request signature.

## Authentication Examples

The examples in this section use the (non-working) credentials in the following table.

Parameter | Value
--------- | -----
AccessKeyId | `1qxji41u`
SecretAccessKey | `432e72e606029aa9d901bdab2c39445d944cb6ac`

In the example `StringToSign`s, formatting is not significant, and `\n` means the Unicode code point `U+000A`, commonly called newline. Also, the examples use "+0000" to designate the time zone. You can use "GMT" to designate timezone instead, but the signatures shown in the examples will be different.

### Example Object GET

Request:

```http
GET /endpoint HTTP/1.1
Host: mysitestacker.com
Date: Tue, 27 Mar 2007 19:36:42 +0000
Authorization: HMAC 1qxji41u:03d552095b8d8b0709022c338f78da7454a0868400353a6636bcb69a5218f978
```

StringToSign:

```bash
GET\n
\n
Tue, 27 Mar 2007 19:36:42 +0000
```

### Example Object POST

Request:

```http
POST /endpoint HTTP/1.1
Host: mysitestacker.com
Content-Type: application/json
Date: Tue, 27 Mar 2007 19:36:42 +0000
Authorization: HMAC 1qxji41u:e150c6305cb6b64c448c9b367c245670fcd734953f90e6e382174a5b5102f431
```

StringToSign:

```bash
POST\n
application/json\n
Tue, 27 Mar 2007 19:36:42 +0000
```

Note the Content-Type header in the request and in the StringToSign.
