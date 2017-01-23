<?php

class Products_model extends CI_Model{
    public function get($id =false)
    {
        if($id==false){
            $q = $this->db->get('gry');
            $q=$q->result();
        }
        else{
            $this->db->where('id',$id);
            $q = $this->db->get('gry');
            $q=$q->row();
        }

        return $q;
    }

    public function update($product){
        $this->db->where('id',$product['id']);
        $this->db->update('gry',$product);
    }

    public  function create($product){
        $this->db->insert('gry', $product);
    }

    public function  delete($product){
        $this->db->where('id', $product['id']);
        $this->db->delete('gry');

    }

    public function setThumb($productId, $product){
        $this->db->where('id',$productId);
        $this->db->update('gry',$product);
    }

}