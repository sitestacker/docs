---
title: Webhooks
category: API
date: 2017-03-24 00:00:00
---

Webhooks allow you to build or set up integrations which subscribe to certain events on a Site Stacker installation. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL.

Webhooks can be installed in the **Webhooks** component in admin. Once installed, they will be triggered each time one or more subscribed events occur.

## Events

When configuring a webhook, you can choose which events you would like to receive payloads for. You can even [opt-in to all current and future events](#wildcard-event). Only subscribing to the specific events you plan on handling is useful for limiting the number of HTTP requests to your server. You can change the list of subscribed events through the Webhooks component anytime.

The available events are:

Name | Description
--- | ---
[*](#wildcard-event) | Any time any event is triggered ([Wildcard Event](#wildcard-event)).
[contribution_create](#contribution-create) | Any time a contribution is created.
[person_type_assignment](#person-type-assignment) | Any time a person type is assigned to a person.

## Payloads

Each event type has a specific payload format with the relevant event information. All event payloads are sent as json.

### Delivery headers

HTTP requests made to your webhook's configured URL endpoint will contain these special headers:

Header | Description
--- | ---
`SiteStacker-Event` | Name of the [event](#events) that triggered this delivery.
`SiteStacker-Signature` | HMAC hex digest of the payload, using the hook's secret as the key (if configured).
`SiteStacker-Delivery` | Unique ID for this delivery.

Also, the `User-Agent` for the requests will be `SiteStacker`.

### Deliveries

For each configured webhook you'll be able to inspect the deliveries (request and response) in the Webhook component, by right clicking your webhook and hitting "Deliveries".

### Failed Deliveries

If the response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a delivery is not `2xx`, the delivery is considered failure and it will be retried 10 times at 1 minute intervals.

## Wildcard Event

Webhooks support a wildcard (`*`) that will match all supported events. When you add the wildcard event, we'll replace any existing events you have configured with the wildcard event and send you payloads for all supported events. You'll also automatically get any new events we might add in the future.

## Ping Event

When you create a new webhook, we'll send you a simple `ping` event to let you know you've set up the webhook correctly. You'll see this event in [Deliveries](#deliveries).

### Ping Event Payload

Key | Value
--- | ---
`hook` | The [webhook configuration](api#get-a-single-webhook)

## Contribution create

When a contribution is created in Site Stacker, we'll send a `contribution_create` event.

### Contribution create Payload

```json
{
    "contribution_batch_id": "9"
}
```

The payload contains the id of the contribution batch. To retrieve its data use the [Contribution batches API endpoint](api#get-a-single-contribution-batch).

## Person type assignment

When a person type is assigned to a person record, we'll send a `person_type_assignment` event. This event is useful if, for example, you want to be notified when a (new) donor is created.

### Person type assignment Payload

```json
{
    "person_type": {
        "id": "18",
        "name": "Donor"
    },
    "person_id": "4609"
}
```

If you're interested in the person type and you need the person record, use the [People endpoint](api#get-a-single-person) with the received `person_id`.
