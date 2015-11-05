---
title: Prevent duplicate records
category: Tips and Tricks
date: 2014-07-24 00:00:00
---

Cake uses the `primaryKey` of a Model for identifying existing records. However there may be cases when you need a multiple columns unique key. For this you need to override the `Model->exists()` method in your models. This replicates the same behaviour as if you would've used a multiple unique key in the datasource.

```php
/**
 * Overrides Model->exists() method so we can check for uniqueness if primary key is not set
 *
 * If a record already exists, sets the primary key of that record to do an update
 *
 * @param int $id
 * @return bool True if the record exists, false otherwise
 */
public function exists($id = null)
{
    if (empty($id) && !$this->getID() && isset($this->data[$this->alias]) && is_array($this->data[$this->alias])) {
        // given $id and primary key are empty, try with data
        $exists = $this->find('first', array(
            'fields' => array($this->primaryKey),
            'conditions' => array(
                'key1'=>$this->data[$this->alias]['key1'],
                'key2'=>$this->data[$this->alias]['key2'],
            ),
            'recursive' => -1,
            'callbacks' => false,
        ));
        if ($exists) {
            $this->set($this->primaryKey, $exists[$this->alias][$this->primaryKey]);
            return true;
        }
    }
    return parent::exists($id);
}
```