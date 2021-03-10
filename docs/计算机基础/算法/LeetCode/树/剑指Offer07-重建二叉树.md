### 剑指 Offer 07. 重建二叉树

[剑指 Offer 07. 重建二叉树 — Medium](https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/)

【题目描述】输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

```
例如，给出
前序遍历 preorder = [3,9,20,15,7]
中序遍历 inorder = [9,3,15,20,7]
返回如下的二叉树：

    3
   / \
  9  20
    /  \
   15   7
```

【解题思路】：递归。通过前序遍历的结果去中序遍历中找到这个节点的左右子树

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder.length == 0 || inorder.length == 0) {
            return null;
        }
        
        TreeNode root = new TreeNode(preorder[0]); //  根节点
        
        // 在中序遍历序列中找到根节点所在位置
        int index = 0;
        for (int i = 0; i < preorder.length; i ++) {
            if (inorder[i] == root.val) {
                index = i;
            }
        }
        
        // 递归处理(copyOfRange 左闭右开)
        root.left = buildTree(
            Arrays.copyOfRange(preorder, 1, index+1),
            Arrays.copyOfRange(inorder, 0, index)); // 左子树
        root.right = buildTree(
            Arrays.copyOfRange(preorder, index+1, preorder.length),
            Arrays.copyOfRange(inorder, index+1, preorder.length)); // 右子树
        
        return root;
    }
}
```