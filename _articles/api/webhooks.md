---
title: Webhooks
category: API
date: 2018-04-02 00:00:00
---

<aside style="float: right; border-radius: 5px; border: 1px solid #f0f4f7; border-left-width: 2px; width: 350px; padding: 0 16px 16px 16px; margin: 0 0 0 40px; position: relative; z-index: 2;     font-size: 95%; background-color: #fff;">
<h4>Webhook terminology</h4>
<p>An <i>event</i> is triggered when a certain action occurs in Site Stacker, such as a gift is made or a CRM record is updated. Each occurrence has a corresponding <b><code>Event</code></b> payload.</p>
<p><i>Webhook endpoints</i> are URLs defined by users to which Site Stacker sends events. A single event may be sent to many webhook endpoints.</p>
<p><i>Webhooks</i> refers to the overall concept of sending notifications to webhook endpoints.</p>
</aside>

Webhooks allow you to build or set up integrations which subscribe to certain events on a Site Stacker installation. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL.

Webhooks can be installed in the **Webhooks** component in admin. Once installed, they will be triggered each time one or more subscribed events occur.

## Events

When configuring a webhook, you can choose which events you would like to receive payloads for. You can even [opt-in to all current and future events](#wildcard-event). Only subscribing to the specific events you plan on handling is useful for limiting the number of HTTP requests to your server. You can change the list of subscribed events through the Webhooks component anytime.

The available events are:

Name | Description
--- | ---
[`*`](#wildcard-event) | Any time any event is triggered ([Wildcard Event](#wildcard-event)).
`campaign_create` | Any time a campaign is created.
`campaign_update` | Any time a campaign is updated.
`campaign_delete` | Any time a campaign is deleted.
`contribution_batch_create` | Any time a contribution batch is created.
`contribution_batch_update` | Any time a contribution batch is updated.
`contribution_create` | Any time a contribution is created.
`contribution_update` | Any time a contribution is updated.
`person_create` | Any time a person is created.
`person_update` | Any time a person is updated.
`person_delete` | Any time a person is deleted.
`person_address_create` | Any time an address is created.
`person_address_update` | Any time an address is updated.
`person_address_delete` | Any time an address is deleted.
`person_email_create` | Any time an email is created.
`person_email_update` | Any time an email is updated.
`person_email_delete` | Any time an email is deleted.
`person_phone_create` | Any time a phone is created.
`person_phone_update` | Any time a phone is updated.
`person_phone_delete` | Any time a phone is deleted.
`person_relation_create` | Any time a new relation is created for a person.
`person_relation_update` | Any time an existing relation is updated. This is rarely used as only `description` can be updated.
`person_relation_delete` | Any time a relation is deleted from a person.
[`person_type_assign`](#person-type-assign) | Any time a person type is assigned to a person.
[`person_type_unassign`](#person-type-unassign) | Any time a person type is unassigned from a person.
`recurring_create` | Any time a recurring contribution is created.
`recurring_update` | Any time a recurring contribution is updated.
`recurring_delete` | Any time a recurring contribution is deleted.
`recurring_cancel` | Any time a recurring contribution is canceled.
`recurring_reactivate` | Any time a canceled recurring contribution is reactivated.
`tag_category_create` | Any time a tag category is created.
`tag_category_update` | Any time a tag category is updated.
`tag_category_delete` | Any time a tag category is deleted.
`tag_create` | Any time a tag is created.
`tag_update` | Any time a tag is updated.
`tag_delete` | Any time a tag is deleted.
`tag_assign` | Any time a tag is assigned to a record (check `model` for specific record, e.g. `Person`).
`tag_unassign` | Any time a person type is unassigned from a record (check `model` for specific record, e.g. `Person`).

## Payloads

Each event type has a payload sent as json, which is the same as the GET API endpoint for the record that the event refers to.

For example `campaign_create`, `campaign_update` and `campaign_delete` events all have the response body of the `/api/campaigns/{id}` endpoint as payload.

> Important: For `*_delete` events, it's recommended to only rely on the record's first level data, as associated data could be `null`, if it was deleted before the event fired. For example `campaign_delete` won\'t include the `item` record.

### Delivery headers

HTTP requests made to your webhook's configured URL endpoint will contain these special headers:

Header | Description
--- | ---
`SiteStacker-Event` | Name of the [event](#events) that triggered this delivery.
`SiteStacker-Signature` | HMAC hex digest of the payload, using the hook's secret as the key (if configured).
`SiteStacker-Delivery` | Unique ID for this delivery.
`Request-Id` | This header can be used to prevent infinite request loops. See [Request Loops](#request-loops) below.

Also, the `User-Agent` for the requests will be `SiteStacker`.

### Deliveries

For each configured webhook you'll be able to inspect the deliveries (request and response) in the Webhook component, by right clicking your webhook and hitting "Deliveries".

### Failed Deliveries

If the response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a delivery is not `2xx`, the delivery is considered failure and it will be retried 10 times at 1 minute intervals.

### Request Loops

To prevent infinite request loops, Site Stacker provides a mechanism you can use. When calling the API, you can set the `Request-Id` header and it will be sent back in any subsequent webhook event generated as a result of your API call.

So the `Request-Id` acts as a globally unique identifier (GUID) that you can account for when processing webhook deliveries.

## Wildcard Event

Webhooks support a wildcard (`*`) that will match all supported events. When you add the wildcard event, we'll replace any existing events you have configured with the wildcard event and send you payloads for all supported events. You'll also automatically get any new events we might add in the future.

## Ping Event

When you create a new webhook, we'll send you a simple `ping` event to let you know you've set up the webhook correctly. You'll see this event in [Deliveries](#deliveries).

### Ping Event Payload

Key | Value
--- | ---
`hook` | The webhook configuration

## Person type assign

This event is useful if, for example, you want to be notified when a person becomes a donor.

The payload contains two keys: `person_type` and `person`. The `person` key contains all the data of the `GET /api/people/{id}` endpoint.

```json
{
    "person_type": {
        "id": "18",
        "name": "Donor"
    },
    "person": {
        "...": "[ all the data of the GET /api/people/{id} endpoint ]"
    }
}
```

## Person type unassign

This has the same payload as the [`person_type_assign`](#person-type-assign) event.